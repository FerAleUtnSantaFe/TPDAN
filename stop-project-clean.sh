cd backend
cd ms-docker
docker-compose -f docker-compose-rabbit.yml down -v
docker-compose -f docker-compose-rabbit.yml down -v
docker-compose -f docker-compose-graylog.yml down -v
docker-compose -f docker-compose-zipin.yml down -v
docker-compose -f docker-compose-perf.yml down -v
cd ..
cd dan-eureka-srv
docker-compose down -v
cd ..
cd ms-clientes
docker-compose down -v
cd ..
cd ms-productos
docker-compose down -v
cd ..
cd ms-pedidos
docker-compose down -v
cd ..
cd dan-gateway
docker-compose down -v
cd ..
cd ..
cd frontend
docker-compose down -v