🔐 **_Complete Authentication Flow_**

```
                           ┌─────────────────────┐
                           │       USER          │
                           └──────────┬──────────┘
                                      │
                       ┌──────────────┴──────────────┐
                       │                             │
                  SIGNUP                          LOGIN
                     │                             │
                     ↓                             ↓
             username/email/password       email/password
                     │                             │
                     ↓                             ↓
             Validate fields               Validate fields
                     │                             │
                     ↓                             ↓
              User exists?                  Find user by email
                 /    \                       /       \
               YES     NO                  NO          YES
                │       │                   │            │
                ↓       ↓                   ↓            ↓
          "Already     bcrypt.hash()    "User not     bcrypt.compare()
           exists"         │              found"          │
                            ↓                            ↓
                       Create user                   Password?
                       in MongoDB                    /       \
                                                     NO        YES
                                                     │          │
                                                     ↓          ↓
                                              "Invalid password" │
                                                                ↓
                                                           jwt.sign()
                                                                │
                                                                ↓
                                                          NEW JWT TOKEN
                                                                │
                                                                ↓
                                                         res.cookie()
                                                                │
                                                                ↓
                                                          Browser/Postman
                                                                │
                                                                ↓
                                                          token cookie

```

**SIGNUP FLOW**

```
USER
 │
 │ username + email + password
 ↓
POST /signup
 │
 ↓
Validate fields
 │
 ├── Missing? ──────→ 400
 │
 ↓
Find user by email
 │
 ├── Exists? ───────→ 400 "User already exists"
 │
 ↓
bcrypt.hash(password, 10)
 │
 ↓
Create user
 │
 ↓
MongoDB
 │
 ├── username
 ├── email
 └── hashed password
 │
 ↓
Signup successful

```

**LOGIN FLOW**

```
USER
 │
 │ email + password
 ↓
POST /login
 │
 ↓
Validate fields
 │
 ├── Missing? ──────→ 400
 │
 ↓
Find user by email
 │
 ├── Not found? ──────→ 400
 │
 ↓
bcrypt.compare(plainPassword, hashedPassword)
 │
 ├── Wrong password? ──→ 400
 │
 ↓
Generate JWT
 │
 ├── Payload: { id, username }
 │
 └── secret from .env
 │
 ↓
Create cookie: token
 │
 ├── httpOnly = true
 │
 └── secure = production
 │
 ↓
Login successful

```

**JWT TOKEN VERIFICATION **

```

                  JWT
                  │
        ┌─────────┴─────────┐
        │                   │
      Payload            Signature
        │                   │
        ↓                   ↓
    user._id          JWT_SECRET
    username

```

**FETCH USER FLOW**

```

USER
 │
 │ GET /user
 ↓
Browser/Postman
 │
 │ Cookie automatically attached
 ↓
┌───────────────────────────┐
│ Cookie: token = JWT       │
└─────────────┬─────────────┘
              ↓
        req.cookies.token
              │
              ↓
          token exists?
           /       \
         NO         YES
         │           │
         ↓           ↓
    401 Unauthorized jwt.verify()
                     │
                     │ JWT_SECRET
                     ↓
                Token valid?
                 /       \
               NO         YES
               │           │
               ↓           ↓
           401         decodedToken
                           │
                           ↓
                      decodedToken.id
                           │
                           ↓
                    MongoDB findById()
                           │
                     ┌─────┴─────┐
                     │           │
                   Not found    Found
                     │           │
                     ↓           ↓
                    404       User data
                                 │
                                 ↓
                              Response
```

**LOGOUT FLOW**
\*cookie belongs to the browser/session

```
USER
 │
 │ GET /logout
 ↓
Browser/Postman
 │
 │ Cookie automatically attached
 ↓
┌───────────────────────────┐
│ Cookie: token = JWT       │
└─────────────┬─────────────┘
              ↓
        res.clearCookie("token")
              │
              ↓
      Cookie removed from browser
              │
              ↓
          Response
```

**Complete System Flow**

```
                         AUTHENTICATION SYSTEM
                                  │
             ┌────────────────────┼────────────────────┐
             │                    │                    │
           SIGNUP                LOGIN               LOGOUT
             │                    │                    │
             ↓                    ↓                    ↓
       Validate fields      Validate fields       POST /logout
             │                    │                    │
             ↓                    ↓                    ↓
       Check user          Find user by email    Current cookie
             │                    │                    │
             ↓                    ↓                    ↓
       Hash password       Compare password      clearCookie()
             │                    │                    │
             ↓                    ↓                    ↓
       Save MongoDB        jwt.sign()             Cookie removed
             │                    │                    │
             ↓                    ↓                    ↓
          SUCCESS          New JWT created       LOGGED OUT
                                  │
                                  ↓
                            res.cookie()
                                  │
                                  ↓
                              Browser
                                  │
                                  ↓
                            TOKEN STORED
                                  │
                                  ↓
                              GET /user
                                  │
                                  ↓
                         Cookie automatically sent
                                  │
                                  ↓
                         req.cookies.token
                                  │
                                  ↓
                            jwt.verify()
                                  │
                                  ↓
                           decodedToken.id
                                  │
                                  ↓
                          MongoDB findById()
                                  │
                                  ↓
                            USER DETAILS

```

```
┌───────────────────────────────────────────┐
│              AUTH GOLDEN RULE             │
├───────────────────────────────────────────┤
│                                           │
│ Signup → Create account                   │
│ Login  → Create JWT                       │
│ User   → Verify JWT                       │
│ Logout → Destroy JWT cookie               │
│                                           │
│ NEVER delete the MongoDB user on logout.  │
│                                           │
└───────────────────────────────────────────┘
```

```
SIGNUP:  User → Hash → DB
LOGIN:   DB → Compare → JWT → Cookie
FETCH:   Cookie → Verify → ID → DB
LOGOUT:  Cookie → Clear
```

```
┌───────────────────────────────────────────┐
│           CRITICAL SERVER LOGS            │
├───────────────────────────────────────────┤
│                                           │
│ Signup error: E11000                    │
│ → User already exists                   │
│                                           │
│ Login error: Invalid password           │
│ → Wrong email or password                 │
│                                           │
│ User error: Unauthorized                  │
│ → No cookie or invalid token              │
│                                           │
│ Logout success                            │
│ → Cookie cleared                          │
│                                           │
└───────────────────────────────────────────┘
```
