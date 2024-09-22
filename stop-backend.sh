docker network rm backend-net
cd servicio-clientes
docker-compose down
cd ..
cd servicio-productos
docker-compose down
cd ..
cd servicio-pedidos
docker-compose down
cd ..


