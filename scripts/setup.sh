echo "Setting up"

ENV_FILE=.env

if [[ -f "$ENV_FILE" ]]; then
    echo "Env file already exists"
else 
    echo "POSTGRES_USER=" >> .env
    echo "POSTGRES_PASSWORD=" >> .env 
    echo "POSTGRES_DB=" >> .env
    echo "DATABASE_URL=" >> .env
    echo "PORT=" >> .env
    echo "SECRET=" >> .env
    echo "SALT=" >> .env
    echo "MAIL_USER=" >> .env
    echo "MAIL_PASS=" >> .env
    echo "NODE_ENV=" >> .env
    echo "VITE_NODE_ENV=" >> .env
fi
