



<p align="center">
  <img width="500" src="https://github.com/gusgeek/SolarDB-Server/blob/main/logo.svg">
  <br>
  <br>
SolarDB Server es el motor de Base de Datos que usar SolarDBCore como motor CRUD, siendo SolarDB Server un DB NoSQL basado en API’s.  <br>
Este, es un Proyecto para la experiencia de la herramienta y creatividad. Busca ser polifuncional, practica y rápida.
</p>

#


<p align="center">
  <br><br>
  <strong>
    Este proyecto se encuentra en fase experimental, puede sufrir cambios
  </strong>
  <br><br>
</p>


# Instalacion

- Podrás instalar SolarDB Server en tu Equipo mediante NodeJS mediante el comando `npm i`
- Mediante la herramienta compilada para tu plataforma

# Comandos

### Creacion de Tokens Criptograficos
Este esta pensado en crear un UUID generico y aleatorio para tener de llave para la encriptacion de Tokens y Datos que se guardan en la Base de Datos
Si bien, hoy todo puede ser bulnerado de muchqas formas, este metodo provee un factor que facilita la instalacion.

Obtendremos este ejecutando la siguiente linea:
- `npm test tokens`
- `node index.js tokens`
- `<Compilado> tokens`
  
De esa forma, obtendremos lo siguiente
  
```
Tokens Generados 

fd881bbf-bece-4a1c-83d9-f488fa0de10f
8f15fb42-3e69-4b54-8863-3a60edfc2965
```
### Creacion de Usuarios y Tokens
De manera temporal y enfocado a que es una version en desarrollo, se planeo utilizar un comando para poder crear Usuarios, de manera aleatoria.

Obtendremos este ejecutando la siguiente linea:
- `npm test nuser`
- `node index.js nuser`
- `<Compilado> nuser`
  
De esa forma, obtendremos lo siguiente
  
```
User {
  username: '86Dtz',
  password: 'lLYhhZDTmmko',
  token: 'KkD7gAe3bcZvsPFJUr1KLy-pJRJD2C3daeIyMVW50Eo'
}
```

# Configuracion
- Es necesario tener el archivo de configuacion stack.json, este es el que tendra la configuracion del servidor.
- El directorio que tiene que tener es /config/cors.json y este debe estar justo al lado del ejecutor.

Puede configurar este de manera manual siguiendo la especificacion de abajo, o colocando `<ejecutor> setup` de manera automatica creara el archivo de configuracion por usted.

Este es el archivo de configuracion en el que estableceremos los Tokens, Directorio donde se guardara la informacion y el Puerto de escucha. Este se establece en .env (Envoirement)

```js
  PORT="1802"
  CONTAINER="C:\\Users\\agust\\Desktop\\Nueva carpeta (2)\\data\\"
  HTOKEN="da05774b-01a5-4b14-adff-07a1304f6f69"
  HINDEX="349e83fd-9128-4251-beff-5532a725afaa"
```

Ptss:
Si no creas el archivo, tan solo inicia el servicio que en el primer arranque creara la configuracion de maner automatica

# Seguridad
(En construccion)

SolarDB esta basado en un CRUD de Files y Express.js. Es importante entender que el contexto donde este instalado SolarDB debera ser controlado y aseguridado contra ataques. 

De manera propia, SolarDB debe tener configurado Tokens de encriptacion para los usuarios y para los datos. Este utilizara JSON WebToken para encriptar y desencriptar los datos.

Los datos que usted ingrese o solicite, se veran en JSON para el tratado. Pero una vez guarde un dato sea por Insert o Update, este se encripta de forma automatica con un Hash HS256, permitiendo una capa de seguridad adicional.

Utilizamos Helmet para disponer de un control de Cabeceras HTML, que nos prevee de ataques clasicos como son los CORS o XSS Filter entre otros

## Consejos
- Indique un directorio para las colecciones lejos o poco accesible 
- SolarDB pondra claves de encriptacion UUID Random, puede especificar claves criptograficas mas fuertes
- Evalue utilizar un Proxy Reverso para ocultar o manejar la exposicion a la Internet

# Uso
Para poder tener esta informacion es muy recomendable ver la documenacion de Postman: <a href="https://documenter.getpostman.com/view/10874443/TzseK74L">Ver documentacion de Uso</a>

Tenga en cuenta que para tener el Token de uso, debera de [crear un usuario](https://github.com/gusgeek/SolarDB-Server#creacion-de-usuarios-y-tokens)

<p align="center">
  <br>
  <bR>
    <img src="https://img.shields.io/github/downloads/gusgeek/SolarDB-Server/total">  
    <img src="https://img.shields.io/github/v/release/gusgeek/SolarDB-Server">  
    <img src="https://img.shields.io/github/release-date/gusgeek/SolarDB-Server">  
    <img src="https://img.shields.io/github/languages/code-size/gusgeek/SolarDB-Server">
  <br><br>
  <strong>:pencil2: con :heart:</strong>
</p>
