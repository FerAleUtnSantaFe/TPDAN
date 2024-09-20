docker network create backend-net
cd servicio-clientes
docker-compose up -d
cd ..
cd servicio-productos
docker-compose up -d
cd ..

