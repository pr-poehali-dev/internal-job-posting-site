import json

ADMIN_LOGIN = "admin"
ADMIN_PASSWORD = "admin"
ADMIN_TOKEN = "admin-secret-token-2024"

def handler(event: dict, context) -> dict:
    """Авторизация администратора портала вакансий"""
    cors = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "GET, POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type, X-Admin-Token",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors, "body": ""}

    if event.get("httpMethod") == "GET":
        token = event.get("headers", {}).get("x-admin-token", "")
        if token == ADMIN_TOKEN:
            return {"statusCode": 200, "headers": cors, "body": json.dumps({"ok": True})}
        return {"statusCode": 401, "headers": cors, "body": json.dumps({"ok": False})}

    body = json.loads(event.get("body") or "{}")
    login = body.get("login", "")
    password = body.get("password", "")

    if login == ADMIN_LOGIN and password == ADMIN_PASSWORD:
        return {
            "statusCode": 200,
            "headers": cors,
            "body": json.dumps({"ok": True, "token": ADMIN_TOKEN}),
        }

    return {
        "statusCode": 401,
        "headers": cors,
        "body": json.dumps({"ok": False, "error": "Неверный логин или пароль"}),
    }
