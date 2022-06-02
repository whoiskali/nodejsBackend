Install dependencies
"npm i"

Initialize database and seed
"npx prisma migrate dev --name init"

Login Credential
username = profile
password = 1234

Edit connection string in .env

Create Profile
POST	http://localhost:3000/api/createProfile
application/json
AUTHORIZATION BEARER
{
    "firstName": string,
    "address": string,
    "email": string,
    "lastName": string,
    "password": string,
    "phoneNumber": string,
    "postCopde": string,
    "userName": string
} 

Update Profile
PUT	http://localhost:3000/api/editProfile/{id}
application/json
AUTHORIZATION BEARER
{
    "firstName": string,
    "address": string,
    "email": string,
    "lastName": string,
    "password": string,
    "phoneNumber": string,
    "postCopde": string,
    "userName": string
}  

Get Profiles
GET	http://localhost:3000/api/getProfiles
AUTHORIZATION BEARER

Get Profile by Id
GET	http://localhost:3000/api/getProfile/{id}
AUTHORIZATION BEARER

Delete Profile by Id
DELETE	http://localhost:3000/api/deleteProfile/{id}
AUTHORIZATION BEARER
