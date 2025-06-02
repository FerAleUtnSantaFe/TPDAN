cd backend
cd ms-docker
docker-compose -f docker-compose-rabbit.yml down
docker-compose -f docker-compose-rabbit.yml down
docker-compose -f docker-compose-graylog.yml down
docker-compose -f docker-compose-zipin.yml down
docker-compose -f docker-compose-perf.yml down
cd ..
cd dan-eureka-srv
docker-compose down
cd ..
cd ms-clientes
docker-compose down
cd ..
cd ms-productos
docker-compose down
cd ..
cd ms-pedidos
docker-compose down
cd ..
cd dan-gateway
docker-compose down
cd ..
cd ..
cd frontend
docker-compose down
