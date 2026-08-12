# Python API — Complete Interview Notes

> Covers: Core theory, building APIs (Flask/FastAPI), consuming APIs (requests), authentication, coding exercises, and scenario-based interview questions.

---

## Table of Contents
1. [API Fundamentals (Theory)](#1-api-fundamentals-theory)
2. [HTTP Deep Dive](#2-http-deep-dive)
3. [REST API Design](#3-rest-api-design)
4. [Consuming APIs with `requests`](#4-consuming-apis-with-requests)
5. [Building APIs with Flask](#5-building-apis-with-flask)
6. [Building APIs with FastAPI](#6-building-apis-with-fastapi)
7. [Authentication & Security](#7-authentication--security)
8. [Async APIs](#8-async-apis)
9. [Testing APIs](#9-testing-apis)
10. [Error Handling, Rate Limiting, Pagination](#10-error-handling-rate-limiting-pagination)
11. [Coding Interview Questions](#11-coding-interview-questions)
12. [Scenario-Based Design Questions](#12-scenario-based-design-questions)
13. [Rapid-Fire Theory Q&A](#13-rapid-fire-theory-qa)
14. [Best Practices Checklist](#14-best-practices-checklist)

---

## 1. API Fundamentals (Theory)

### What is an API?
An **API (Application Programming Interface)** is a contract that lets two software systems communicate — a set of rules defining how requests and responses are structured, without exposing internal implementation.

### Types of APIs
| Type | Description | Example |
|---|---|---|
| REST | Resource-based, stateless, uses HTTP verbs | Twitter API |
| SOAP | XML-based, strict contract (WSDL), heavier | Legacy banking systems |
| GraphQL | Client specifies exact data shape needed | GitHub API v4 |
| gRPC | Binary protocol over HTTP/2, uses Protobuf | Internal microservices |
| WebSocket | Full-duplex, persistent connection | Chat apps, live feeds |

### Why REST is popular
- Stateless → scales horizontally easily
- Uses standard HTTP → cacheable, widely supported
- Human-readable (usually JSON)
- Loose coupling between client and server

### Client-Server Architecture
- **Client**: initiates request (browser, mobile app, another service)
- **Server**: processes request, returns response
- Separation of concerns: client handles UI, server handles data/logic

---

## 2. HTTP Deep Dive

### HTTP Methods (Verbs)
| Method | Purpose | Idempotent? | Safe? | Has Body? |
|---|---|---|---|---|
| GET | Retrieve resource | Yes | Yes | No |
| POST | Create resource | No | No | Yes |
| PUT | Replace resource entirely | Yes | No | Yes |
| PATCH | Partially update resource | No* | No | Yes |
| DELETE | Remove resource | Yes | No | No |
| HEAD | Like GET but no body (headers only) | Yes | Yes | No |
| OPTIONS | Discover allowed methods (CORS preflight) | Yes | Yes | No |

*PATCH is not idempotent by spec, though many implementations make it so.

**Idempotent** = calling it multiple times has the same effect as calling it once.
**Safe** = doesn't modify server state.

### Status Codes
| Range | Meaning | Common Codes |
|---|---|---|
| 1xx | Informational | 100 Continue |
| 2xx | Success | 200 OK, 201 Created, 202 Accepted, 204 No Content |
| 3xx | Redirection | 301 Moved Permanently, 304 Not Modified |
| 4xx | Client Error | 400 Bad Request, 401 Unauthorized, 403 Forbidden, 404 Not Found, 405 Method Not Allowed, 409 Conflict, 422 Unprocessable Entity, 429 Too Many Requests |
| 5xx | Server Error | 500 Internal Server Error, 502 Bad Gateway, 503 Service Unavailable, 504 Gateway Timeout |

**Interview trap:** 401 vs 403
- `401 Unauthorized` → you are **not authenticated** (no/invalid token)
- `403 Forbidden` → you **are authenticated** but lack permission

### Headers Cheat Sheet
```
Content-Type: application/json
Authorization: Bearer <token>
Accept: application/json
Cache-Control: no-cache
X-RateLimit-Remaining: 42
ETag: "33a64df5"
```

---

## 3. REST API Design

### Six REST Constraints
1. Client-Server separation
2. Statelessness (no session stored on server between requests)
3. Cacheability
4. Uniform Interface (consistent resource naming, HTTP verbs)
5. Layered System (proxies, gateways transparent to client)
6. Code on Demand (optional — server can send executable code)

### URL / Resource Naming Conventions
```
GOOD:
GET    /users             → list users
GET    /users/42          → get user 42
POST   /users              → create user
PUT    /users/42          → replace user 42
PATCH  /users/42          → partial update
DELETE /users/42          → delete user 42
GET    /users/42/orders   → nested resource

BAD:
GET /getUsers
POST /createUser
GET /user_list
```
Rules of thumb: **plural nouns**, no verbs in the path, use nesting for relationships, use query params for filtering/sorting (`/users?role=admin&sort=-created_at`).

### Versioning Strategies
- URI versioning: `/v1/users` (most common, simplest)
- Header versioning: `Accept: application/vnd.myapp.v1+json`
- Query param: `/users?version=1`

### Richardson Maturity Model (common interview question)
- **Level 0**: Single endpoint, one HTTP verb (POST), like RPC over HTTP
- **Level 1**: Multiple resource URIs, still one verb
- **Level 2**: Proper use of HTTP verbs + status codes (most real-world APIs stop here)
- **Level 3**: HATEOAS — responses include hypermedia links to related actions

---

## 4. Consuming APIs with `requests`

### Basic Calls
```python
import requests

# GET with query params
resp = requests.get(
    "https://api.example.com/users",
    params={"role": "admin"},
    headers={"Authorization": "Bearer TOKEN"},
    timeout=5
)
resp.raise_for_status()          # raises HTTPError on 4xx/5xx
data = resp.json()

# POST with JSON body
resp = requests.post(
    "https://api.example.com/users",
    json={"name": "Alice", "email": "alice@example.com"},
    timeout=5
)

# PUT / PATCH / DELETE
requests.put(url, json=payload)
requests.patch(url, json=partial_payload)
requests.delete(url)
```

### Session Reuse (connection pooling — performance-critical for interviews)
```python
session = requests.Session()
session.headers.update({"Authorization": "Bearer TOKEN"})

resp1 = session.get("https://api.example.com/users")
resp2 = session.get("https://api.example.com/orders")
session.close()
```
Why it matters: a `Session` reuses the underlying TCP connection (keep-alive), avoiding the overhead of a new handshake per request — important under load.

### Retry with Backoff
```python
from requests.adapters import HTTPAdapter
from urllib3.util.retry import Retry

session = requests.Session()
retries = Retry(
    total=3,
    backoff_factor=1,          # 1s, 2s, 4s...
    status_forcelist=[429, 500, 502, 503, 504],
    allowed_methods=["GET", "POST"]
)
session.mount("https://", HTTPAdapter(max_retries=retries))
```

### Handling Errors Properly
```python
try:
    resp = requests.get(url, timeout=5)
    resp.raise_for_status()
except requests.exceptions.Timeout:
    print("Request timed out")
except requests.exceptions.ConnectionError:
    print("Network problem")
except requests.exceptions.HTTPError as e:
    print(f"HTTP error: {e.response.status_code}")
except requests.exceptions.RequestException as e:
    print(f"Unhandled error: {e}")
```

---

## 5. Building APIs with Flask

### Minimal REST API
```python
from flask import Flask, jsonify, request, abort

app = Flask(__name__)

users = {1: {"id": 1, "name": "Alice"}}
next_id = 2

@app.route("/users", methods=["GET"])
def list_users():
    return jsonify(list(users.values())), 200

@app.route("/users/<int:user_id>", methods=["GET"])
def get_user(user_id):
    user = users.get(user_id)
    if not user:
        abort(404, description="User not found")
    return jsonify(user), 200

@app.route("/users", methods=["POST"])
def create_user():
    global next_id
    data = request.get_json(silent=True)
    if not data or "name" not in data:
        return jsonify({"error": "name is required"}), 400
    user = {"id": next_id, "name": data["name"]}
    users[next_id] = user
    next_id += 1
    return jsonify(user), 201

@app.route("/users/<int:user_id>", methods=["DELETE"])
def delete_user(user_id):
    if user_id not in users:
        abort(404)
    del users[user_id]
    return "", 204

@app.errorhandler(404)
def not_found(e):
    return jsonify({"error": str(e)}), 404

if __name__ == "__main__":
    app.run(debug=True)
```

### Flask Blueprints (modular structure for larger apps)
```python
# users/routes.py
from flask import Blueprint
users_bp = Blueprint("users", __name__, url_prefix="/users")

@users_bp.route("/", methods=["GET"])
def list_users():
    ...

# app.py
app.register_blueprint(users_bp)
```

### Flask-RESTful (class-based views, common in interviews)
```python
from flask_restful import Resource, Api

api = Api(app)

class UserResource(Resource):
    def get(self, user_id):
        return users.get(user_id), 200

    def delete(self, user_id):
        users.pop(user_id, None)
        return "", 204

api.add_resource(UserResource, "/users/<int:user_id>")
```

---

## 6. Building APIs with FastAPI

FastAPI is the modern go-to for interviews — built on Starlette + Pydantic, async-native, auto-generates OpenAPI docs.

```python
from fastapi import FastAPI, HTTPException, status
from pydantic import BaseModel

app = FastAPI()

class User(BaseModel):
    id: int
    name: str
    email: str | None = None

class UserCreate(BaseModel):
    name: str
    email: str | None = None

db: dict[int, User] = {}
counter = 0

@app.get("/users", response_model=list[User])
def list_users():
    return list(db.values())

@app.get("/users/{user_id}", response_model=User)
def get_user(user_id: int):
    if user_id not in db:
        raise HTTPException(status_code=404, detail="User not found")
    return db[user_id]

@app.post("/users", response_model=User, status_code=status.HTTP_201_CREATED)
def create_user(payload: UserCreate):
    global counter
    counter += 1
    user = User(id=counter, **payload.dict())
    db[counter] = user
    return user

@app.delete("/users/{user_id}", status_code=204)
def delete_user(user_id: int):
    db.pop(user_id, None)
    return None
```

**Why interviewers like FastAPI questions:**
- Pydantic gives automatic request **validation** (type errors → 422 automatically)
- Dependency Injection system (`Depends`) for auth, DB sessions
- Native `async def` support
- Auto docs at `/docs` (Swagger) and `/redoc`

### Dependency Injection Example
```python
from fastapi import Depends

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.get("/users/{user_id}")
def get_user(user_id: int, db=Depends(get_db)):
    return db.query(User).get(user_id)
```

### Flask vs FastAPI (frequent interview comparison)
| Aspect | Flask | FastAPI |
|---|---|---|
| Async support | Limited/manual | Native |
| Validation | Manual / extensions | Built-in via Pydantic |
| Docs generation | Manual (flasgger etc.) | Automatic (OpenAPI/Swagger) |
| Performance | Good | Higher (Starlette + async) |
| Learning curve | Simpler, more flexible | Slightly more structured |
| Type hints | Optional | Core to the framework |

---

## 7. Authentication & Security

### Common Auth Schemes
| Scheme | How it works | Use case |
|---|---|---|
| API Key | Static key sent in header/query | Simple service-to-service |
| Basic Auth | Base64(username:password) in header | Internal tools, quick setups |
| Bearer Token / JWT | Signed token sent as `Authorization: Bearer` | Modern stateless auth |
| OAuth2 | Delegated access via auth server, access + refresh tokens | Third-party login (Google, GitHub) |
| Session/Cookie | Server stores session, cookie sent each request | Traditional web apps |

### JWT Basics (frequently asked)
A JWT has 3 parts: `header.payload.signature`
- **Header**: algorithm + token type
- **Payload**: claims (user id, expiry `exp`, roles) — NOT encrypted, just base64 encoded
- **Signature**: verifies integrity, signed with secret/private key

```python
import jwt   # PyJWT
import datetime

payload = {"user_id": 42, "exp": datetime.datetime.utcnow() + datetime.timedelta(hours=1)}
token = jwt.encode(payload, "secret_key", algorithm="HS256")

try:
    decoded = jwt.decode(token, "secret_key", algorithms=["HS256"])
except jwt.ExpiredSignatureError:
    print("Token expired")
except jwt.InvalidTokenError:
    print("Invalid token")
```

**Key point:** JWT payload is only *base64-encoded*, not encrypted — never put secrets (like passwords) in it.

### FastAPI Auth Dependency Example
```python
from fastapi import Depends, HTTPException
from fastapi.security import OAuth2PasswordBearer

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

def get_current_user(token: str = Depends(oauth2_scheme)):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=["HS256"])
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid credentials")
    return payload

@app.get("/me")
def read_me(user=Depends(get_current_user)):
    return user
```

### Security Best Practices (commonly asked)
- Always use **HTTPS**
- Never expose stack traces / internal errors to clients
- Validate & sanitize all input (prevent injection)
- Use **rate limiting** to prevent abuse
- Set short-lived access tokens + refresh tokens
- Enable **CORS** carefully — don't use `*` with credentials
- Hash passwords with **bcrypt/argon2**, never store plaintext
- Use API gateways for centralized auth, logging, throttling

---

## 8. Async APIs

### Why Async Matters
- I/O-bound operations (DB calls, external API calls) release the event loop instead of blocking a thread → far higher throughput under concurrent load.
- CPU-bound work does **not** benefit from `async` — use multiprocessing instead.

### Async with `aiohttp` (client)
```python
import aiohttp
import asyncio

async def fetch(session, url):
    async with session.get(url) as resp:
        return await resp.json()

async def main():
    urls = ["https://api.example.com/1", "https://api.example.com/2"]
    async with aiohttp.ClientSession() as session:
        tasks = [fetch(session, u) for u in urls]
        results = await asyncio.gather(*tasks)
        print(results)

asyncio.run(main())
```

### Async FastAPI Endpoint
```python
@app.get("/data")
async def get_data():
    async with aiohttp.ClientSession() as session:
        async with session.get("https://external-api.com/data") as resp:
            return await resp.json()
```

**Interview trap:** Mixing blocking calls (like `requests.get`) inside an `async def` route blocks the entire event loop — defeating the purpose. Use `httpx.AsyncClient` or `aiohttp` instead, or run blocking code in a thread pool via `run_in_threadpool`.

---

## 9. Testing APIs

### Flask Testing
```python
import pytest
from app import app

@pytest.fixture
def client():
    app.config["TESTING"] = True
    with app.test_client() as client:
        yield client

def test_get_users(client):
    resp = client.get("/users")
    assert resp.status_code == 200
    assert isinstance(resp.get_json(), list)

def test_create_user(client):
    resp = client.post("/users", json={"name": "Bob"})
    assert resp.status_code == 201
    assert resp.get_json()["name"] == "Bob"
```

### FastAPI Testing
```python
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_create_user():
    resp = client.post("/users", json={"name": "Bob"})
    assert resp.status_code == 201
    assert resp.json()["name"] == "Bob"
```

### Mocking External API Calls
```python
from unittest.mock import patch

@patch("myapp.requests.get")
def test_external_call(mock_get):
    mock_get.return_value.status_code = 200
    mock_get.return_value.json.return_value = {"result": "ok"}
    response = my_function_that_calls_api()
    assert response["result"] == "ok"
```

---

## 10. Error Handling, Rate Limiting, Pagination

### Consistent Error Response Shape
```json
{
  "error": {
    "code": "USER_NOT_FOUND",
    "message": "No user with id 42",
    "status": 404
  }
}
```

### Global Error Handler (FastAPI)
```python
from fastapi.responses import JSONResponse
from fastapi import Request

@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    return JSONResponse(
        status_code=500,
        content={"error": {"message": "Internal server error"}}
    )
```

### Rate Limiting (concept + simple implementation)
Common algorithms: **Fixed Window**, **Sliding Window**, **Token Bucket**, **Leaky Bucket**.

```python
import time
from collections import defaultdict

class RateLimiter:
    def __init__(self, max_requests=5, window=60):
        self.max_requests = max_requests
        self.window = window
        self.requests = defaultdict(list)

    def is_allowed(self, client_id):
        now = time.time()
        # drop timestamps outside the window
        self.requests[client_id] = [
            t for t in self.requests[client_id] if now - t < self.window
        ]
        if len(self.requests[client_id]) < self.max_requests:
            self.requests[client_id].append(now)
            return True
        return False
```

### Pagination Patterns
```
Offset-based:  GET /users?limit=20&offset=40
Cursor-based:  GET /users?limit=20&cursor=eyJpZCI6NDB9
```
Cursor-based is preferred at scale (offset pagination degrades on large tables and breaks if rows are inserted mid-page).

```python
@app.get("/users")
def list_users(limit: int = 20, cursor: int | None = None):
    query = db.query(User)
    if cursor:
        query = query.filter(User.id > cursor)
    results = query.order_by(User.id).limit(limit).all()
    next_cursor = results[-1].id if results else None
    return {"data": results, "next_cursor": next_cursor}
```

---

## 11. Coding Interview Questions

### Q1: Write a decorator that retries a function on failure (simulating flaky API calls)
```python
import time
import functools

def retry(max_attempts=3, delay=1, exceptions=(Exception,)):
    def decorator(func):
        @functools.wraps(func)
        def wrapper(*args, **kwargs):
            attempts = 0
            while attempts < max_attempts:
                try:
                    return func(*args, **kwargs)
                except exceptions as e:
                    attempts += 1
                    if attempts == max_attempts:
                        raise
                    time.sleep(delay * attempts)  # exponential-ish backoff
        return wrapper
    return decorator

@retry(max_attempts=3, delay=1, exceptions=(requests.exceptions.RequestException,))
def call_api():
    resp = requests.get("https://api.example.com/data", timeout=3)
    resp.raise_for_status()
    return resp.json()
```

### Q2: Design an in-memory LRU cache for API responses
```python
from collections import OrderedDict

class LRUCache:
    def __init__(self, capacity: int):
        self.capacity = capacity
        self.cache = OrderedDict()

    def get(self, key):
        if key not in self.cache:
            return None
        self.cache.move_to_end(key)
        return self.cache[key]

    def put(self, key, value):
        if key in self.cache:
            self.cache.move_to_end(key)
        self.cache[key] = value
        if len(self.cache) > self.capacity:
            self.cache.popitem(last=False)   # evict least recently used
```
*Follow-up interviewers ask:* add TTL expiry, make it thread-safe (use `threading.Lock`), or convert to Redis for a distributed cache.

### Q3: Fetch multiple API endpoints concurrently and combine results
```python
import asyncio
import aiohttp

async def fetch_all(urls):
    async with aiohttp.ClientSession() as session:
        async def fetch(url):
            async with session.get(url) as r:
                return await r.json()
        return await asyncio.gather(*(fetch(u) for u in urls))

# Thread-based alternative (if using the sync `requests` lib):
from concurrent.futures import ThreadPoolExecutor

def fetch_all_threaded(urls):
    with ThreadPoolExecutor(max_workers=10) as executor:
        return list(executor.map(lambda u: requests.get(u).json(), urls))
```

### Q4: Implement a simple API request validator using a schema
```python
def validate_payload(data: dict, schema: dict) -> list[str]:
    errors = []
    for field, rules in schema.items():
        if rules.get("required") and field not in data:
            errors.append(f"{field} is required")
            continue
        if field in data and not isinstance(data[field], rules["type"]):
            errors.append(f"{field} must be of type {rules['type'].__name__}")
    return errors

schema = {
    "name": {"type": str, "required": True},
    "age": {"type": int, "required": False},
}
errors = validate_payload({"name": "Alice", "age": "30"}, schema)
# -> ["age must be of type int"]
```

### Q5: Implement basic API pagination logic over an in-memory list
```python
def paginate(items: list, page: int, page_size: int) -> dict:
    start = (page - 1) * page_size
    end = start + page_size
    total_pages = (len(items) + page_size - 1) // page_size
    return {
        "data": items[start:end],
        "page": page,
        "total_pages": total_pages,
        "has_next": page < total_pages
    }
```

### Q6: Write a function to flatten a nested JSON API response
```python
def flatten_json(nested: dict, parent_key="", sep=".") -> dict:
    items = {}
    for key, value in nested.items():
        new_key = f"{parent_key}{sep}{key}" if parent_key else key
        if isinstance(value, dict):
            items.update(flatten_json(value, new_key, sep))
        elif isinstance(value, list):
            for i, v in enumerate(value):
                items.update(flatten_json({str(i): v}, new_key, sep))
        else:
            items[new_key] = value
    return items
```

---

## 12. Scenario-Based Design Questions

### Scenario 1: "Design a URL shortener API"
- Endpoints: `POST /shorten` (body: long_url → returns short_code), `GET /{short_code}` (302 redirect)
- Storage: hash map / DB table `short_code -> long_url`, generate code via base62 encoding of an auto-increment ID (avoids collisions cleanly) or hashing + collision check
- Add: expiry, click analytics, custom aliases, rate limiting per user
- Scale concerns: cache hot short codes in Redis, use a DB read replica for redirects

### Scenario 2: "Your API is slow under load — how do you debug and fix it?"
1. Check monitoring/APM (latency, error rate, DB query time)
2. Identify N+1 query problems → use eager loading / joins
3. Add caching layer (Redis) for expensive/read-heavy endpoints
4. Add pagination if returning large payloads
5. Move heavy work to background jobs (Celery) and return `202 Accepted`
6. Scale horizontally behind a load balancer; add a CDN for static/cacheable responses
7. Add connection pooling for DB and outbound HTTP clients

### Scenario 3: "How would you version an API without breaking existing clients?"
- Prefer additive changes (new optional fields) — non-breaking
- For breaking changes: introduce `/v2/...` and deprecate `/v1/...` with a sunset header/timeline
- Communicate via changelog + `Deprecation` and `Sunset` HTTP headers

### Scenario 4: "Design rate limiting for a public API with multiple tiers (free/paid)"
- Identify client via API key
- Store counters in Redis with `INCR` + `EXPIRE` (sliding/fixed window)
- Return `429 Too Many Requests` + `Retry-After` header when exceeded
- Different limits per tier stored in a config/DB, checked before hitting the counter

### Scenario 5: "A third-party API you depend on is unreliable — design resilience"
- Add **timeouts** on every call (never call without one)
- **Retry** with exponential backoff + jitter for transient errors (5xx, timeouts)
- **Circuit breaker** pattern: stop calling a failing service for a cool-down period after N consecutive failures (libraries: `pybreaker`)
- **Fallback**: cached/stale data or a default response
- **Bulkhead**: isolate failures so this dependency can't exhaust all threads/connections

### Scenario 6: "How do you keep an API backward compatible when a field type changes?"
- Don't change types in place; add a new field (`price_v2`) and deprecate the old one
- Use API versioning for actual breaking contract changes
- Validate with contract tests (e.g., Pact) so consumers are alerted before deploy

### Scenario 7: "Design idempotent POST requests for a payments API"
- Client sends an `Idempotency-Key` header (UUID) with each request
- Server stores `(idempotency_key -> response)` for a TTL window
- On retry with the same key, return the cached response instead of re-processing the payment

---

## 13. Rapid-Fire Theory Q&A

**Q: Difference between PUT and PATCH?**
PUT replaces the entire resource (send the full object); PATCH applies a partial update (only changed fields).

**Q: What makes an API RESTful vs just "using HTTP"?**
Following REST constraints: statelessness, proper resource-based URLs, correct verb usage, cacheability — not just returning JSON over HTTP.

**Q: What is CORS and why does it exist?**
Cross-Origin Resource Sharing — a browser security mechanism that blocks a webpage from making requests to a different origin unless the server explicitly allows it via `Access-Control-Allow-Origin` headers.

**Q: Explain statelessness in REST.**
Each request must contain all information needed to process it (auth, params) — the server stores no client session between requests. This enables horizontal scaling since any server instance can handle any request.

**Q: What is idempotency and why does it matter for APIs?**
An idempotent operation produces the same result no matter how many times it's called. It matters for safe retries — e.g., a client can safely retry a `DELETE` or `PUT` after a timeout without worrying about duplicate side effects; retrying `POST` is unsafe without an idempotency key.

**Q: What's the difference between synchronous and asynchronous API calls?**
Sync: caller blocks until the response arrives. Async: caller continues execution, response is handled later (callback, `await`, webhook, polling).

**Q: What is a webhook, and how does it differ from polling?**
A webhook is a server-to-server callback: the provider POSTs data to your URL when an event happens. Polling means the client repeatedly asks "anything new?" — webhooks are more efficient (push vs. pull).

**Q: How do you secure sensitive data in an API response?**
Never return passwords/secrets; use field-level filtering/serializers, encrypt sensitive fields at rest, use HTTPS in transit, apply the principle of least privilege on what each token/role can see.

**Q: What is GraphQL and how does it differ from REST?**
GraphQL exposes a single endpoint where clients specify exactly what fields they need in a query, avoiding over-fetching/under-fetching common in REST's fixed resource shapes. Trade-off: more complex caching, and endpoint-level rate limiting is harder.

**Q: What's the role of `Content-Type` and `Accept` headers?**
`Content-Type` tells the server what format the request body is in (e.g., `application/json`); `Accept` tells the server what format the client wants back.

**Q: What is HATEOAS?**
"Hypermedia As The Engine Of Application State" — API responses include links to related/available actions, so clients can navigate the API dynamically instead of hardcoding URLs.

**Q: Difference between authentication and authorization?**
Authentication = verifying *who* you are (login). Authorization = verifying *what* you're allowed to do (permissions/roles).

**Q: What is an API Gateway?**
A single entry point that sits in front of backend services, handling routing, auth, rate limiting, logging, and request/response transformation centrally.

**Q: How does GIL affect building high-performance APIs in Python?**
The Global Interpreter Lock means only one thread executes Python bytecode at a time, limiting true parallelism for CPU-bound work in threads. I/O-bound API work (waiting on network/DB) isn't hurt much because the GIL is released during I/O — use `asyncio` or multiprocessing for CPU-heavy tasks.

**Q: What's the difference between `requests` and `httpx`?**
`requests` is synchronous only. `httpx` supports both sync and async, and has a very similar API — often chosen for async FastAPI backends that need to call external APIs.

---

## 14. Best Practices Checklist

- [ ] Use nouns, not verbs, in URLs; plural resource names
- [ ] Return correct, specific HTTP status codes
- [ ] Version your API from day one (`/v1/...`)
- [ ] Validate all input; never trust the client
- [ ] Use consistent error response format across all endpoints
- [ ] Add pagination for any endpoint returning collections
- [ ] Always set timeouts on outbound HTTP calls
- [ ] Log requests/responses (without sensitive data) for observability
- [ ] Rate-limit public endpoints
- [ ] Document with OpenAPI/Swagger
- [ ] Write integration tests for every endpoint (happy path + error path)
- [ ] Use HTTPS everywhere; never send tokens in query strings
- [ ] Keep handlers thin — push business logic into service layers
- [ ] Design for idempotency on write operations where possible

---

### Quick Prep Tip
When asked "design an API for X" in an interview, structure your answer as:
1. **Clarify requirements** (scale, auth needs, read vs write heavy)
2. **List endpoints** (resources + verbs)
3. **Data model** (key entities/fields)
4. **Non-functional concerns** (auth, rate limiting, caching, error handling)
5. **Scale/reliability** (what breaks first, how you'd fix it)
