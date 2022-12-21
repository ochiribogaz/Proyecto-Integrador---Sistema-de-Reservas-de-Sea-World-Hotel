# Proyecto-Integrador-Sistema-de-Reservas-de-Sea-World-Hotel

## Requisitos
* MongoDBCompass
* Visual Studio Code
* Angular CLI: 14.2.4
* Node: 16.17.1
* Manejador de paquetes: npm 8.19.2

## Descarga e instalación del proyecto
1. Crear una carpeta
2. Dentro de la carpeta, abrir una termina y ejecutar el comando:
```
git clone https://github.com/ochiribogaz/Proyecto-Integrador-Sistema-de-Reservas-de-Sea-World-Hotel.git
```
3. Entrar a la carpeta que se creó del proyecto.
3. Dentro del proyecto, abrir una terminal y ejecutar el comando:
```
npm install
```
4. Abrir otra terminal y entrar a la carpeta "app_public". En Windows se puede realizar con el comando:
```
cd app_public
```
5. Para crear las colecciones en la base de datos descomentar el código que se encuentra en cada uno de los archivos de la carpeta "app_api/models" y realizar el paso 6. Posteriormente, se debe comentar este código nuevamente.
6. Para ejecutar la aplicación realizada en Node.js y la API de REST, ejecutar el comando:
```
npm start
```
o el comando
```
nodemon
```
Las aplicaciones correrán en el puerto 3000 del localhost.

7. Para correr el sistema de administración de reservas, dentro de la carpeta "app_public" ejecutar el comando:
```
ng serve
```
La aplicación correra en el puerto 4200 del localhost.
