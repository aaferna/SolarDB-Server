



<p align="center">
  <img width="500" src="https://github.com/gusgeek/SolarDB-Server/blob/main/logo.svg">
  <br>
  <br>
SolarDB Server es un servidor de Base de Datos que usar SolarDB Core como motor, siendo este un NoSQL basado en API’s.  <br/>
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
Esta pensado para crear un UUID generico y aleatorio para trabajar la encriptacion de Tokens y Datos que se guardan en la Base de Datos.
Si bien, hoy todo puede ser vulnerado de muchas formas, este metodo provee un factor que facilita la obtención de claves para este propósito, sin necesidades de reconfigurar la aplicación.

Obtendremos este ejecutando la siguiente linea:
- `<Compilado> tokens`
  
Obtendremos lo siguiente
  
```
Tokens Generados 

fd881bbf-bece-4a1c-83d9-f488fa0de10f
8f15fb42-3e69-4b54-8863-3a60edfc2965
```

### Creacion de Usuarios y Tokens
Dispone de una utilidad que permite crear usuarios con permisos total mediante termial de manera practica. Para esto [USERCMD](https://github.com/gusgeek/SolarDB-Server#usercmd), debe estar habilitado.

Obtendremos este ejecutando la siguiente linea:
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

- Es necesario tener el archivo de configuacion .env, este junto con el ejecutable. Este es el que tendra la configuracion del servidor

Puede configurar este de manera manual siguiendo la especificacion de abajo, o colocando `<ejecutor> setup` de manera automatica creara el archivo de configuracion por usted.

Este es el archivo de configuracion en el que estableceremos los Tokens, Directorio de Datos y Log junto al Puerto de escucha. 


```js
      PORT="1802"
      CONTAINER="E:\\Escritorio\\SolarDB\\data\\"
      LOG="E:\\Escritorio\\SolarDB\\log\\"
      HTOKEN="e102175c-b310-4055-86a2-896e9c3f7a56"
      HINDEX="ba639372-89f0-48a5-8962-5ebd8dc0ae72"
      USERCMD=TRUE
```

### USERCMD
Este parametro nos permite declarar si autorizamos crear usuarios por Terminal o no. De manera automatica se creara en TRUE, pero si no volvera a utilizarlo cambie a FALSE para mas seguridad.

# Manejador de Errores

En el caso de enviar un cuerpo que no corresponda a un JSON valido tendremos dos tipos de respuestas

En este caso si se envia cualquier cosa que no sea un JSON

```json
{
    "status": 100,
    "msg": "Los datos enviados no son JSON"
}
```

ó

```json
{
    "status": 199,
    "msg": "Token o JSON erroneo"
}
```

| ERROR CODE  | Descripcion                                    |
| ----------- | ---------------------------------------------- |
| 70          | No se encontro el index                        |
| 75          | No se creo el Index                            |
| 80          | No se actualizo el Index                       |
| 85          | No se encontro el index                        |
| 90          | No se encontraron datos                        |
| 95          | No se encontraron datos                        |
| 100         | Los datos enviados no son JSON                 |
| 140         | Index Eliminado                                |
| 150         | Index Creado                                   |
| 160         | Los datos fueron guardados                     |
| 170         | Datos encontrados                              |
| 180         | Datos encontrados                              |
| 190         | Datos encontrados                              |
| 199         | Token o JSON erroneo                           |
| 200         | Existe un error interno                        |
| 201         | Token es erroneo                               |
| 202         | El usuario no tiene permisos de escritura      |
| 203         | Fallo la consulta: consulta mal armada         |
| 204         | No se creo el Index                            |

Los mensajes de errores seran optimizados en versiones consiguientes

# Seguridad
(En construccion)

- SolarDB esta basado en un CRUD de Files y Express.js. Es importante entender que el contexto donde este instalado SolarDB debera ser controlado y aseguridado contra ataques. 

- De manera propia, SolarDB debe tener configurado Tokens de encriptacion para los usuarios y para los datos. Este utilizara JSON WebToken para encriptar y desencriptar los datos.

- Los datos que usted ingrese o solicite, se veran y guardaran en JSON. Pero una vez guarde un dato sea por Insert o Update, este se encripta de forma automatica con JSON Web Token con Hash HS256, permitiendo una capa de seguridad adicional.

- Utilizamos Helmet para disponer de un control de Cabeceras HTML, que nos prevee de ataques clasicos como son los CORS o XSS Filter entre otros

## Consejos
- Indique un directorio para las colecciones lejos o poco accesible 
- SolarDB pondra claves de encriptacion UUID Random, puede especificar claves criptograficas personalizadas
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
