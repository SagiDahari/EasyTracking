FROM python:alpine3.19

WORKDIR /myapp

COPY requirements.txt .

RUN pip install --no-cache-dir -r requirements.txt

COPY . .

EXPOSE 8000

CMD ["uvicorn", "main:app", "--reload","--host", "0.0.0.0", "--port", "8000"]