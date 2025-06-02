cd backend
docker network create backend-net
cd ms-docker
docker network create backend-net frontend-net
docker-compose -f docker-compose-rabbit.yml up -d --build
docker-compose -f docker-compose-graylog.yml up -d --build
docker-compose -f docker-compose-zipin.yml up -d --build
docker-compose -f docker-compose-perf.yml up -d --build
cd ..
cd dan-eureka-srv
docker-compose up -d --build
cd ..
cd ms-clientes
docker-compose up -d --build
cd ..
cd ms-productos
docker-compose up -d --build
cd ..
cd ms-pedidos
docker-compose up -d --build
cd ..
cd dan-gateway
docker-compose up -d --build
cd ..
cd ..
cd frontend
docker network create frontend-net
docker-compose up -d --build
