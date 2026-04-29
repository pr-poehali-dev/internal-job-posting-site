import json
import os
import psycopg2

SCHEMA = "t_p49643675_internal_job_posting"
ADMIN_TOKEN = "admin-secret-token-2024"

CORS = {
    "Access-Control-Allow-Origin": "*",
    "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
    "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
}


def get_conn():
    return psycopg2.connect(os.environ["DATABASE_URL"])


def check_admin(event: dict) -> bool:
    token = event.get("headers", {}).get("x-admin-token", "")
    return token == ADMIN_TOKEN


def row_to_job(row) -> dict:
    return {
        "id": row[0],
        "title": row[1],
        "department": row[2],
        "level": row[3],
        "role": row[4],
        "location": row[5],
        "city": row[6],
        "workMode": row[7],
        "salary": row[8],
        "posted": row[9],
        "hot": row[10],
        "tags": list(row[11]),
        "desc": row[12],
        "fullDesc": row[13],
        "requirements": list(row[14]),
        "conditions": list(row[15]),
        "team": row[16],
        "recruiter": row[17],
        "recruiterEmail": row[18],
    }


def handler(event: dict, context) -> dict:
    """CRUD-апи для управления вакансиями (публичный GET, остальное — только для админа)"""

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": CORS, "body": ""}

    method = event.get("httpMethod", "GET")
    path = event.get("path", "/")
    parts = [p for p in path.strip("/").split("/") if p]
    job_id = int(parts[-1]) if parts and parts[-1].isdigit() else None

    conn = get_conn()
    cur = conn.cursor()

    try:
        if method == "GET":
            cur.execute(
                f"SELECT id, title, department, level, role, location, city, work_mode, salary, posted, hot, tags, description, full_desc, requirements, conditions, team, recruiter, recruiter_email FROM {SCHEMA}.jobs ORDER BY created_at DESC"
            )
            jobs = [row_to_job(r) for r in cur.fetchall()]
            return {"statusCode": 200, "headers": CORS, "body": json.dumps(jobs, ensure_ascii=False)}

        if not check_admin(event):
            return {"statusCode": 403, "headers": CORS, "body": json.dumps({"error": "Нет доступа"})}

        body = json.loads(event.get("body") or "{}")

        if method == "POST":
            cur.execute(
                f"""INSERT INTO {SCHEMA}.jobs
                    (title, department, level, role, location, city, work_mode, salary, posted, hot, tags, description, full_desc, requirements, conditions, team, recruiter, recruiter_email)
                    VALUES (%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s,%s)
                    RETURNING id""",
                (
                    body.get("title", ""), body.get("department", ""), body.get("level", ""),
                    body.get("role", ""), body.get("location", ""), body.get("city", ""),
                    body.get("workMode", ""), body.get("salary", ""), body.get("posted", "Сегодня"),
                    bool(body.get("hot", False)), body.get("tags", []), body.get("desc", ""),
                    body.get("fullDesc", ""), body.get("requirements", []), body.get("conditions", []),
                    body.get("team", ""), body.get("recruiter", ""), body.get("recruiterEmail", ""),
                ),
            )
            new_id = cur.fetchone()[0]
            conn.commit()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True, "id": new_id})}

        if method == "PUT" and job_id:
            cur.execute(
                f"""UPDATE {SCHEMA}.jobs SET
                    title=%s, department=%s, level=%s, role=%s, location=%s, city=%s, work_mode=%s,
                    salary=%s, posted=%s, hot=%s, tags=%s, description=%s, full_desc=%s,
                    requirements=%s, conditions=%s, team=%s, recruiter=%s, recruiter_email=%s
                    WHERE id=%s""",
                (
                    body.get("title", ""), body.get("department", ""), body.get("level", ""),
                    body.get("role", ""), body.get("location", ""), body.get("city", ""),
                    body.get("workMode", ""), body.get("salary", ""), body.get("posted", "Сегодня"),
                    bool(body.get("hot", False)), body.get("tags", []), body.get("desc", ""),
                    body.get("fullDesc", ""), body.get("requirements", []), body.get("conditions", []),
                    body.get("team", ""), body.get("recruiter", ""), body.get("recruiterEmail", ""),
                    job_id,
                ),
            )
            conn.commit()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

        if method == "DELETE" and job_id:
            cur.execute(f"DELETE FROM {SCHEMA}.jobs WHERE id=%s", (job_id,))
            conn.commit()
            return {"statusCode": 200, "headers": CORS, "body": json.dumps({"ok": True})}

        return {"statusCode": 400, "headers": CORS, "body": json.dumps({"error": "Неверный запрос"})}

    finally:
        cur.close()
        conn.close()
