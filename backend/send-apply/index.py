import os
import json
import smtplib
import base64
from email.mime.multipart import MIMEMultipart
from email.mime.text import MIMEText
from email.mime.base import MIMEBase
from email import encoders


def handler(event: dict, context) -> dict:
    """
    Отправка отклика на вакансию на почту vacancy@company.company.
    Принимает: job_title, recruiter_email, full_name, email, department, comment, resume_base64, resume_filename.
    """
    cors_headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST, OPTIONS",
        "Access-Control-Allow-Headers": "Content-Type",
    }

    if event.get("httpMethod") == "OPTIONS":
        return {"statusCode": 200, "headers": cors_headers, "body": ""}

    body = json.loads(event.get("body") or "{}")

    job_title = body.get("job_title", "Вакансия")
    recruiter_email = body.get("recruiter_email", "vacancy@company.company")
    full_name = body.get("full_name", "Не указано")
    user_email = body.get("email", "")
    department = body.get("department", "")
    comment = body.get("comment", "")
    resume_base64 = body.get("resume_base64", "")
    resume_filename = body.get("resume_filename", "resume.pdf")

    smtp_host = os.environ.get("SMTP_HOST", "")
    smtp_port = int(os.environ.get("SMTP_PORT", "587"))
    smtp_user = os.environ.get("SMTP_USER", "")
    smtp_password = os.environ.get("SMTP_PASSWORD", "")

    TO = "vacancy@company.company"

    msg = MIMEMultipart("alternative")
    msg["Subject"] = f"Отклик на вакансию: {job_title}"
    msg["From"] = f"Карьерный портал <{smtp_user}>"
    msg["To"] = TO
    msg["Reply-To"] = user_email if user_email else smtp_user

    html_body = f"""
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; background: #f8fafc; padding: 24px; border-radius: 12px;">
      <div style="background: #3b82f6; border-radius: 10px; padding: 20px 24px; margin-bottom: 24px;">
        <h1 style="color: #fff; margin: 0; font-size: 20px;">Новый отклик на вакансию</h1>
        <p style="color: #bfdbfe; margin: 6px 0 0; font-size: 15px;">{job_title}</p>
      </div>

      <div style="background: #fff; border-radius: 10px; padding: 20px 24px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; font-size: 15px; margin: 0 0 16px; border-bottom: 1px solid #f1f5f9; padding-bottom: 10px;">Данные кандидата</h2>
        <table style="width: 100%; border-collapse: collapse;">
          <tr><td style="color: #64748b; padding: 6px 0; font-size: 14px; width: 140px;">ФИО:</td><td style="color: #1e293b; font-weight: bold; font-size: 14px;">{full_name}</td></tr>
          <tr><td style="color: #64748b; padding: 6px 0; font-size: 14px;">Email:</td><td style="color: #3b82f6; font-size: 14px;"><a href="mailto:{user_email}" style="color: #3b82f6;">{user_email}</a></td></tr>
          <tr><td style="color: #64748b; padding: 6px 0; font-size: 14px;">Подразделение:</td><td style="color: #1e293b; font-size: 14px;">{department or '—'}</td></tr>
          <tr><td style="color: #64748b; padding: 6px 0; font-size: 14px;">Вакансия:</td><td style="color: #1e293b; font-weight: bold; font-size: 14px;">{job_title}</td></tr>
        </table>
      </div>

      {"" if not comment else f'''
      <div style="background: #fff; border-radius: 10px; padding: 20px 24px; margin-bottom: 16px; border: 1px solid #e2e8f0;">
        <h2 style="color: #1e293b; font-size: 15px; margin: 0 0 12px;">Сопроводительное письмо</h2>
        <p style="color: #475569; font-size: 14px; line-height: 1.6; margin: 0;">{comment}</p>
      </div>
      '''}

      <p style="color: #94a3b8; font-size: 12px; text-align: center; margin: 0;">Карьерный портал · отклик отправлен автоматически</p>
    </div>
    """

    msg.attach(MIMEText(html_body, "html", "utf-8"))

    if resume_base64:
        try:
            resume_data = base64.b64decode(resume_base64)
            part = MIMEBase("application", "octet-stream")
            part.set_payload(resume_data)
            encoders.encode_base64(part)
            part.add_header("Content-Disposition", f'attachment; filename="{resume_filename}"')
            msg.attach(part)
        except Exception:
            pass

    if not smtp_host or not smtp_user or not smtp_password:
        return {
            "statusCode": 503,
            "headers": cors_headers,
            "body": json.dumps({"error": "SMTP не настроен. Добавьте секреты SMTP_HOST, SMTP_USER, SMTP_PASSWORD."}, ensure_ascii=False),
        }

    if smtp_port == 465:
        server = smtplib.SMTP_SSL(smtp_host, smtp_port, timeout=15)
    else:
        server = smtplib.SMTP(smtp_host, smtp_port, timeout=15)
        server.starttls()

    server.login(smtp_user, smtp_password)
    server.sendmail(smtp_user, [TO], msg.as_bytes())
    server.quit()

    return {
        "statusCode": 200,
        "headers": cors_headers,
        "body": json.dumps({"ok": True, "message": "Отклик успешно отправлен"}, ensure_ascii=False),
    }
