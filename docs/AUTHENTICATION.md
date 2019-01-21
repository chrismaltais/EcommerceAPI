# Authentication

The following endpoints are secured and require a JWT to be passed in as a request header:
### Product Resources
- **PUT** `/api/v2/products{sku}`
### Cart Resources
- **POST** `/api/v2/cart`
- **GET** `/api/v2/cart`
- **PUT** `/api/v2/cart/{sku}/{quantity}`
- **POST** `/api/v2/cart/checkout`

## Obtaining a valid JWT
A user is created in the database once the database has been seeded, and we'll be using those credentials in order to log in.
### Logging in
To log in, ensure the server is running and curl one of the following commands:
```
curl --location --request POST "localhost:3000/api/v2/login" \
  --header "Content-Type: application/json" \
  --data "{
    \"email\": \"chris.maltais@shopify.ca\",
    \"password\": \"IdLikeToWorkHere\"
}" | json_pp 
```
**OR**
```
curl -H "Content-Type: application/json" \
-d @login-credentials.json \
http://localhost:3000/api/v2/login | json_pp 
```
> This uses a file in the repository called `login-credentials.json` that contains the login credentials

### Example Response
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzQ1ZmY2M2IwNGVlMDAwMmI2OGQ1ZTgiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTQ4MDkzNzk0fQ.nj4BNY9o8sLQk8qddCtzQifCMXfkqIEhVA_PSOC3RC0"
}
```
**Copy this token to a secure location - as it will be required as the `x-auth` token to access secured routes!**

### Generating a Token file (optional)
If you do not want to copy the token, you may generate a file upon logging in that contains the token to use for reference.
```
curl -H "Content-Type: application/json" \
-d @login-credentials.json \
http://localhost:3000/api/v2/login | json_pp > user-token.json
```
> This will create a file `user-token.json` in the root directory of the app which contains the token information for reference.

**Example `user-token.json` contents**
```
{
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzQ1ZmY2M2IwNGVlMDAwMmI2OGQ1ZTgiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTQ4MDkzNzk0fQ.nj4BNY9o8sLQk8qddCtzQifCMXfkqIEhVA_PSOC3RC0"
}
```

### Assigning token to bash variable (optional)
If you do not want to continuously copy/paste the token in the headers for curl requests, you can set a bash variable equal to your token in your terminal.

**Example assignment**
```
token=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJfaWQiOiI1YzQ1ZmY2M2IwNGVlMDAwMmI2OGQ1ZTgiLCJhY2Nlc3MiOiJhdXRoIiwiaWF0IjoxNTQ4MDkzNzk0fQ.nj4BNY9o8sLQk8qddCtzQifCMXfkqIEhVA_PSOC3RC0
```

**Validate assignment worked**

`echo $token`

**Example use**

`curl localhost:3000/api/v2/cart -H x-auth:$token | json_pp`

## Destroying JWT
Upon logging out, the token will be destroyed, and you will need to log in again to acquire a new token.

**Note**: Your cart information will persist between sessions!

```
curl -X DELETE  localhost:3000/api/v2/logout \
-H x-auth:$token | json_pp
```
**OR if you created a `user-token.json` file:**
```
curl -X DELETE  localhost:3000/api/v2/logout \
-H x-auth:$token | json_pp && rm user-token.json
```
