# Visionhub

## Repositorios relacionados

[Angular repository](https://github.com/r0zh/VisionHub-angular): Angular frontend

[Flask repository](https://github.com/r0zh/VisionHub-flask): Flask microservice


## Despliegue de la aplicación (temporalmente apagado para ahorrar recursos)
[VisionHub (laravel)](http://laravelloadbalancer-1413397690.us-east-1.elb.amazonaws.com/)

[VisionHub (angular)](http://angularloadbalancer-279767366.us-east-1.elb.amazonaws.com/)

[Flask microservice](http://flaskloadbalancer-64905749.us-east-1.elb.amazonaws.com) (Hacer petición al endpoint get_image mediante post para probar) 

## Notion del proyecto 
[Notion](https://www.notion.so/e67ae944be194b38bcba67d7642c7b3f?v=912bed725fd94a7dab5d94a88ed09741) 

[Anteproyecto](https://www.notion.so/Anteproyecto-ab2ea79e76064f66812afe1d15b711fb)

## Instalación y Uso

Para instalar y utilizar VisionHub, sigue estos pasos:

1.  Clona el repositorio del proyecto.
2.  Navega al directorio del proyecto.
3.  Configura la conexión a la api de laravel en `src/environments/environment.development.ts` 
4.  Ejecuta `npm install` para instalar las dependencias de Node.js.
5.  Ejecuta `ng serve` para servir angular
6.  Accede al servidor local en `localhost:4200`.

### Cuentas de Prueba

-   **Usuario**: email: [johndoe@gmail.com](mailto:johndoe@gmail.com), contraseña: password, rol: usuario
-   **Moderador**: email: [janedoe@gmail.com](mailto:janedoe@gmail.com), contraseña: password, rol: moderador
-   **Admin**: email: [admin@admin.com](mailto:admin@admin.com), contraseña: password, rol: admin
