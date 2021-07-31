



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
{
  username: 'fNPpt',
  password: 'XspkxvXCnZ2k',
  token: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.Ijc2NzEyNGUyMjY4NDY0ZDE4M2Q1ZDJlOGM2ZTE0Y2JlIg.NaxMjoQ4mja9yDF4uquYFpfD4QYV3-cXYhjAWNG2OIg'
}
```

# Files de Configuracion
Es necesario tener los archivos cors.json y stack.json, seran los que SolarDB utilice para trabajar.
El directorio que tiene que tener es /config/cors.json y /config/cors.json y este debe estar justo al lado del ejecutor.

### stack.json
Este es el archivo de configuracion en el que estableceremos Tokens, Directorio donde se guardara la informacion y el Puerto de escucha.

```json
{
    "port": "1802",
    "container": "./container/",
    "hashToken": "31bf5b0b-478b-4c65-b537-71938dbf9d55",
    "hashIndex": "43e6325e-cf1c-42cc-b6c2-f08138aaa1b8"
}
```

Ptss:
Si no creas el archivo, tan solo inicia el servicio que en el primer arranque creara la configuracion de maner automatica


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
