# smtp_server
SMTP server designed to listen for emails, store them in a database, and notify using an IPC server

## dotenv
The following template includes the script defaults.

```dosini
# commenting out AUTHORIZED_CLIENTS allows ALL
#AUTHORIZE_CLIENTS=[ip address separated by commas ',']
#MONGODB_HOST=localhost
#MONGODB_PORT=27017
#MONGODB_COLLECTION=messages
```