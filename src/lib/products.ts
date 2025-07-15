
'use client';

import { useState, useEffect } from 'react';

export type Product = {
  id: number;
  nombre: string;
  precio: number;
  imagen: string;
  disponibilidad: 'PRODUCTO_DISPONIBLE' | 'PRODUCTO_AGOTADO';
  existencias: number;
  categoria: string;
};

const initialProducts: Product[] = [
  { id: 1, nombre: 'AGUA', precio: 4500, imagen: 'https://avatars.mds.yandex.net/get-altay/1987173/2a000001747d295ce25615afd42a81cb6b9e/XXL_height', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 48, categoria: 'AGUA' },
  { id: 2, nombre: 'AGUA GAS', precio: 4500, imagen: 'https://images.squarespace-cdn.com/content/v1/55697ab8e4b084f6ac0581ef/1543993440671-4K5ZMHREJWHVDD8CHJMP/shutterstock_105912563-1.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 49, categoria: 'AGUA' },
  { id: 3, nombre: 'AGUARDIENTE ANTIOQUEÑO AZUL 375 ML', precio: 60000, imagen: 'https://i.pinimg.com/736x/4f/14/2d/4f142d8493f4082bf274bfd8af785708.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 4, categoria: 'AGUARDIENTE' },
  { id: 4, nombre: 'AGUARDIENTE ANTIOQUEÑO AZUL 750 ML', precio: 120000, imagen: 'https://us-tuna-sounds-images.voicemod.net/54ee1019-8170-4228-98ae-405c2705df79-1677473885644.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 8, categoria: 'AGUARDIENTE' },
  { id: 5, nombre: 'AGUARDIENTE ANTIOQUEÑO ROJO 375 ML', precio: 60000, imagen: 'https://jumbocolombiafood.vteximg.com.br/arquivos/ids/3500151-750-750/7702049000449.jpg?v=637238805202500000', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 3, categoria: 'AGUARDIENTE' },
  { id: 6, nombre: 'AGUARDIENTE ANTIOQUEÑO ROJO 750 ML', precio: 120000, imagen: 'https://cdn2.yopongoelhielo.com/4098/aguardiente-antioqueno.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 5, categoria: 'AGUARDIENTE' },
  { id: 7, nombre: 'AGUARDIENTE ANTIOQUEÑO VERDE 375 ML', precio: 60000, imagen: 'https://lavaquita.co/cdn/shop/products/supermercados_la_vaquita_supervaquita_aguardiente_antioqueno_sin_azucar_375ml_tapa_verde_media_1024x1024.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 8, categoria: 'AGUARDIENTE' },
  { id: 8, nombre: 'AGUARDIENTE ANTIOQUEÑO VERDE 750 ML', precio: 120000, imagen: 'https://www.totalwine.com/dynamic/x1000,sq/media/sys_master/twmmedia/heb/h8a/14396700590110.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 3, categoria: 'AGUARDIENTE' },
  { id: 9, nombre: 'AGUARDIENTE NECTAR AZUL 375 ML', precio: 60000, imagen: 'https://elcorreodelanoche.com.co/wp-content/uploads/2020/02/nectar-azul-375.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 1, categoria: 'AGUARDIENTE' },
  { id: 10, nombre: 'AGUARDIENTE NECTAR AZUL 750 ML', precio: 100000, imagen: 'https://licoreselcastillo.com.co/wp-content/uploads/2024/12/aguardiente-nectar-azul-x-750-cc.webp', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 2, categoria: 'AGUARDIENTE' },
  { id: 11, nombre: 'AGUARDIENTE NECTAR DORADO 375 ML', precio: 60000, imagen: 'https://carulla.vtexassets.com/arquivos/ids/17479601/Aguardiente-Dorado-Media-NECTAR-375-ml-3552215_a.jpg?v=638613322877570000', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'AGUARDIENTE' },
  { id: 12, nombre: 'AGUARDIENTE NECTAR DORADO 750 ML', precio: 100000, imagen: 'https://exitocol.vtexassets.com/arquivos/ids/24497704/Aguardiente-Dorado-NECTAR-750-ml-3488573_a.jpg?v=638613375090730000', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 2, categoria: 'AGUARDIENTE' },
  { id: 13, nombre: 'AGUARDIENTE NECTAR ROJO 375 ML', precio: 60000, imagen: 'https://elcorreodelanoche.com.co/wp-content/uploads/2020/02/nectar-rojo-375.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 1, categoria: 'AGUARDIENTE' },
  { id: 14, nombre: 'AGUARDIENTE NECTAR ROJO 750 ML', precio: 100000, imagen: 'https://image.winudf.com/v2/image1/Y29tLmdvb2RiYXJiZXIubGljb3JhZG9taWNpbGlvbGljb3Jlc2NvcnJlb2JvZ290YTI0aG9yYXNfc2NyZWVuXzIxXzE2NTgwNzk0MzJfMDQ2/screen-21.jpg?fakeurl=1&type=.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'AGUARDIENTE' },
  { id: 15, nombre: 'AGUARDIENTE NECTAR VERDE 375 ML', precio: 60000, imagen: 'https://images.genius.com/127d8a2f62674c50f5c5ea012619ae77.425x425x1.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 8, categoria: 'AGUARDIENTE' },
  { id: 16, nombre: 'AGUARDIENTE NECTAR VERDE 750 ML', precio: 100000, imagen: 'https://dislicores.vteximg.com.br/arquivos/ids/155894-1000-1000/Licores-aguardiente_914000_1.jpg?v=637085599417430000', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 10, categoria: 'AGUARDIENTE' },
  { id: 17, nombre: 'AGUARDIENTE NECTAR VERDE CUBETAZO 750 ML', precio: 99000, imagen: 'https://i.pinimg.com/originals/96/70/dc/9670dcda808c79eb567f2ea3f3ff92ee.png', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'AGUARDIENTE' },
  { id: 18, nombre: 'AGUILA', precio: 4500, imagen: 'https://www.pngkit.com/png/detail/239-2398695_330ml-retornable-botella-de-cerveza-aguila.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 263, categoria: 'CERVEZAS' },
  { id: 19, nombre: 'AGUILA CERO', precio: 4500, imagen: 'https://www.pngkey.com/png/detail/239-2398704_cerveza-aguila-cero-botella-publicidad-de-alcohol-en.png', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'CERVEZAS' },
  { id: 20, nombre: 'AGUILA LIGHT', precio: 4500, imagen: 'https://www.pngfind.com/pngs/m/144-1446300_botella-de-aguila-light-cerveza-colombiana-botella-de.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 139, categoria: 'CERVEZAS' },
  { id: 21, nombre: 'ALKA SELZER', precio: 3000, imagen: 'https://i.ytimg.com/vi/5Q0TZ-JUZ_E/maxresdefault.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 36, categoria: 'FARMACIA' },
  { id: 22, nombre: 'ASPIRINAS', precio: 3000, imagen: 'https://ziliottigroup.it/image/cache/data/farmadati/H0005114-640x736.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 45, categoria: 'FARMACIA' },
  { id: 23, nombre: 'MENTA CHAO BARRA', precio: 3000, imagen: 'https://images-eu.ssl-images-amazon.com/images/I/51z5OzM0p6L._UL1000_.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'DULCES' },
  { id: 24, nombre: 'CHEETOS PERSONAL', precio: 3000, imagen: 'https://image.pngaaa.com/740/1819740-middle.png', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'SNACKS' },
  { id: 25, nombre: 'CHEETOS FAMILIAR', precio: 6000, imagen: 'https://main-cdn.sbermegamarket.ru/big1/hlr-system/-73/211/492/411/217/19/100047774448b0.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'SNACKS' },
  { id: 26, nombre: 'CLUB DORADA', precio: 6000, imagen: 'https://www.zirus.pizza/app_data_archivos/zirusmovil.soomi.co/productos/producto_5e4d2552a19c010dbe909b2305f89191926da6241625241011.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 77, categoria: 'CERVEZAS' },
  { id: 27, nombre: 'CLUB NEGRA', precio: 6000, imagen: 'https://www.bavaria.co/sites/g/files/seuoyk1666/files/2023-10/Club%20Colombia%20Negra.png', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'CERVEZAS' },
  { id: 28, nombre: 'CLUB ROJA', precio: 6000, imagen: 'https://koyotebarbacoa.com/wp-content/uploads/2020/04/club-roja-01.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 58, categoria: 'CERVEZAS' },
  { id: 29, nombre: 'CLUB ZUL', precio: 6000, imagen: 'https://mir-s3-cdn-cf.behance.net/project_modules/max_1200/8db56730454479.562429838cf66.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'CERVEZAS' },
  { id: 30, nombre: 'COCA COLA', precio: 4500, imagen: 'https://main-cdn.sbermegamarket.ru/big2/hlr-system/-13/304/683/368/122/4/100058610203b0.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 15, categoria: 'GASEOSAS' },
  { id: 31, nombre: 'COCTEL', precio: 12000, imagen: 'https://static.insales-cdn.com/images/products/1/2339/308037923/shop_items_catalog_image460.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 10, categoria: 'COCTELES' },
  { id: 32, nombre: 'COLA Y POLA', precio: 4500, imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/e2/Botella-de-cerveza.png/1200px-Botella-de-cerveza.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 6, categoria: 'CERVEZAS' },
  { id: 33, nombre: 'CORONA', precio: 12000, imagen: 'https://www.tapintoyourbeer.com/sites/default/files/beers/coronita_1.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 50, categoria: 'CERVEZAS' },
  { id: 34, nombre: 'CORONITA', precio: 7000, imagen: 'https://mambodelivery.vtexassets.com/arquivos/ids/212265/7891149108749--1-.jpg?v=638537270586500000', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 50, categoria: 'CERVEZAS' },
  { id: 35, nombre: 'COSTEÑA', precio: 4500, imagen: 'https://upload.wikimedia.org/wikipedia/commons/f/fd/Botella-350-sin-collarin-cerveza-colombiana.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 105, categoria: 'CERVEZAS' },
  { id: 36, nombre: 'COSTEÑA VERDE', precio: 4500, imagen: 'https://cdn.forbes.co/2020/07/Botela-coste%C3%B1a-bacana.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 70, categoria: 'CERVEZAS' },
  { id: 37, nombre: 'CUBETAZO CERVEZA', precio: 30000, imagen: 'https://i3.wp.com/dijf55il5e0d1.cloudfront.net/images/na/hubertplus/5315600/5782_main_1000.jpg?resize=758%2C758&ssl=1', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 10, categoria: 'CERVEZAS' },
  { id: 38, nombre: 'DETODITO PERSONAL', precio: 4000, imagen: 'https://mir-s3-cdn-cf.behance.net/projects/max_808/410816114036869.Y3JvcCw4MDgsNjMyLDAsMA.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'SNACKS' },
  { id: 39, nombre: 'DETODITO FAMILIAR', precio: 13000, imagen: 'https://i.pinimg.com/originals/b9/fe/e9/b9fee93357182dac049043ecf3d2d7a4.png', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'SNACKS' },
  { id: 40, nombre: 'DORITOS PERSONAL', precio: 3000, imagen: 'https://i.ytimg.com/vi/G83w1GNW200/maxresdefault.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'SNACKS' },
  { id: 41, nombre: 'DORITOS FAMILIAR', precio: 12000, imagen: 'https://i.ytimg.com/vi/G83w1GNW200/maxresdefault.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'SNACKS' },
  { id: 42, nombre: 'ELECTROLIC', precio: 12400, imagen: 'https://resources.claroshop.com/medios-plazavip/s2/12225/1478316/5ef6459a0eec6-0975051-1600x1600.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 20, categoria: 'BEBIDAS ENERGIZANTES' },
  { id: 43, nombre: 'FOUR LOKO', precio: 22000, imagen: 'https://i.pinimg.com/originals/b4/0a/24/b40a24d32397f32e074ea19f7632846d.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 5, categoria: 'COCTELES' },
  { id: 44, nombre: 'GATORADE', precio: 8000, imagen: 'https://e7.pngegg.com/pngimages/396/162/png-clipart-sports-energy-drinks-fizzy-drinks-gatorade-botella-de-agua-tea-plastic-bottle.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 28, categoria: 'BEBIDAS DEPORTIVAS' },
  { id: 45, nombre: 'GINGER', precio: 4500, imagen: 'https://imageproxy.wolt.com/menu/menu-images/60f949683e6447703c63db6a/e64b7846-eb8b-11eb-a20a-9e292300bb68_schweppes_american_ginger_ale_1_0l.jpeg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 5, categoria: 'GASEOSAS' },
  { id: 46, nombre: 'HALLS BARRA', precio: 3000, imagen: 'https://cdn.100sp.ru/pictures/151612779', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'DULCES' },
  { id: 47, nombre: 'HEINEKEN', precio: 5000, imagen: 'https://main-cdn.sbermegamarket.ru/big2/hlr-system/-72/721/007/112/162/28/100060811879b0.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 46, categoria: 'CERVEZAS' },
  { id: 48, nombre: 'STELLA', precio: 12000, imagen: 'https://upload.wikimedia.org/wikipedia/commons/thumb/c/c2/StellaGlobalBottle-NoReflection-master-cerveza-bavaria.png/640px-StellaGlobalBottle-NoReflection-master-cerveza-bavaria.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 29, categoria: 'CERVEZAS' },
  { id: 49, nombre: 'JARRA GASEOSA', precio: 5000, imagen: 'https://www.smartuk.net/wp-content/uploads/nc/catalog/extra-ecom/olympia-glass-jug.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 1, categoria: 'GASEOSAS' },
  { id: 50, nombre: 'JUGO HIT', precio: 4500, imagen: 'https://www.nicepng.com/png/detail/125-1256395_hit-no-retornable-jarris-botella-de-jugo-hit.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 1, categoria: 'JUGOS' },
  { id: 51, nombre: 'MANI', precio: 3000, imagen: 'https://userscontent2.emaze.com/images/71d847b3-c8bc-4116-b3e8-69d53c715ed6/d846c34d7b42485070a92c3e296ed99f.png', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'SNACKS' },
  { id: 52, nombre: 'MANI MOTO', precio: 3000, imagen: 'https://parce.ca/store/mani-moto-frito-lay-48g/', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'SNACKS' },
  { id: 53, nombre: 'MONSTER ENERGY', precio: 12000, imagen: 'https://i.pinimg.com/736x/f4/91/1f/f4911fd46c53fe3549bc3fdf39455c9e.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 8, categoria: 'BEBIDAS ENERGIZANTES' },
  { id: 54, nombre: 'PAPAS PAQUETE PERSONAL', precio: 3000, imagen: 'https://i.ytimg.com/vi/8wegEEHX6mc/maxresdefault.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'SNACKS' },
  { id: 55, nombre: 'PAPAS PAQUETE FAMILIAR', precio: 10000, imagen: 'https://usabrother.com/205-thickbox_default/dosing-machine-wp-1040a10.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'SNACKS' },
  { id: 56, nombre: 'POKER', precio: 4500, imagen: 'https://www.nicepng.com/png/detail/424-4240135_poker-cerveza.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 252, categoria: 'CERVEZAS' },
  { id: 57, nombre: 'QUATRO', precio: 4500, imagen: 'https://supermercadocomunal.com/verbenal/6576-large_default/gaseosa-quatro-15-lt.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 5, categoria: 'GASEOSAS' },
  { id: 58, nombre: 'RED BULL LATA', precio: 12000, imagen: 'https://cdn1.ozone.ru/s3/multimedia-h/6594216785.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 9, categoria: 'BEBIDAS ENERGIZANTES' },
  { id: 59, nombre: 'RON MEDELLIN DORADO 375 ML', precio: 70000, imagen: 'https://exitocol.vtexassets.com/arquivos/ids/26664391/Ron-Dorado-1368999_a.jpg?v=638739885606900000', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 3, categoria: 'RON' },
  { id: 60, nombre: 'RON MEDELLIN DORADO 750 ML', precio: 120000, imagen: 'https://exitocol.vtexassets.com/arquivos/ids/26664392/Ron-Dorado-1369000_a.jpg?v=638739885617500000', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'RON' },
  { id: 61, nombre: 'RON MEDELLIN TRADICIONAL 375 ML', precio: 70000, imagen: 'https://dw95zbr0bn7mn.cloudfront.net/compare/asset/111268/large_compare::product-4823276-c12532e4-a685-49c1-8047-4dd552399429.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 1, categoria: 'RON' },
  { id: 62, nombre: 'RON MEDELLIN TRADICIONAL 750 ML', precio: 120000, imagen: 'https://i.pinimg.com/736x/a0/81/19/a08119de251f4d7b1b6da27fc3ee9c33.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'RON' },
  { id: 63, nombre: 'RON SANTAFE 375 ML', precio: 70000, imagen: 'https://exitocol.vtexassets.com/arquivos/ids/26666286/RON-ANEJO-MEDIA-740881_a.jpg?v=638739911908100000', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 4, categoria: 'RON' },
  { id: 64, nombre: 'RON SANTAFE 750 ML', precio: 120000, imagen: 'https://exitocol.vtexassets.com/arquivos/ids/26666285/RON-ANEJO-BOTELLA-740880_a.jpg?v=638739911897500000', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 3, categoria: 'RON' },
  { id: 65, nombre: 'RON VIEJO CALDAS TRADICIONAL 375 ML', precio: 70000, imagen: 'https://image.winudf.com/v2/image1/Y29tLmdvb2RiYXJiZXIubGljb3JhZG9taWNpbGlvbGljb3Jlc2NvcnJlb2JvZ290YTI0aG9yYXNfc2NyZWVuXzdfMTY1ODA3OTQxM18wMDM/screen-7.jpg?fakeurl=1&type=.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 5, categoria: 'RON' },
  { id: 66, nombre: 'RON VIEJO CALDAS TRADICIONAL 750 ML', precio: 120000, imagen: 'https://vkuster.ru/static/content/products/3569/photos/main_catalog.jpg?1667478786', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 3, categoria: 'RON' },
  { id: 67, nombre: 'RON VIEJO DE CALDAS ROBLE BLANCO 750ML', precio: 120000, imagen: 'https://winehelp2.ru/upload/iblock/ad2/ufuct4u8aequrmq8f391wg8jzzk3hl33.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 1, categoria: 'RON' },
  { id: 68, nombre: 'SMIRNOFF 275 ML', precio: 12000, imagen: 'https://www.static-src.com/wcsstore/Indraprastha/images/catalog/full/99/MTA-3766635/smirnoff_vodka-smirnoff-275ml-botol-ice_full02.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 13, categoria: 'VODKA' },
  { id: 69, nombre: 'SMIRNOFF LULO 375 ML', precio: 60000, imagen: 'https://licoresquindio.com/wp-content/uploads/2020/06/Smirnoff-Lulo-X1-375ml_Cali.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 2, categoria: 'VODKA' },
  { id: 70, nombre: 'SMIRNOFF LULO 750 ML', precio: 100000, imagen: 'https://kyva.co/wp-content/uploads/2022/06/SMIRNOFF-LULO-700ML_PNG_1000x-800-px_Transparente.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 2, categoria: 'VODKA' },
  { id: 71, nombre: 'SODA', precio: 4500, imagen: 'https://www.sultanatesi.com.tr/upload/soda-22cl.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 5, categoria: 'AGUA' },
  { id: 72, nombre: 'TEQUILA JOSE CUERVO ESPECIAL 375ML', precio: 80000, imagen: 'https://applejack.com/site/images/Jose-Cuervo-Gold-Tequila-375-ml_1.png', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'TEQUILA' },
  { id: 73, nombre: 'TEQUILA JOSE CUERVO ESPECIAL 750 ML', precio: 160000, imagen: 'https://s.alicdn.com/@sc04/kf/U673a124114ef41b58dcd19807764c9c6f.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 3, categoria: 'TEQUILA' },
  { id: 74, nombre: 'TEQUILA JOSE CUERVO ESPECIAL BLANCO 750 ML', precio: 160000, imagen: 'https://main-cdn.sbermegamarket.ru/big1/hlr-system/183/005/461/012/230/9/100028141690b0.png', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'TEQUILA' },
  { id: 75, nombre: 'TEQUILA JOSE CUERVO TRADICIONAL REPOSADO 375 ML', precio: 80000, imagen: 'https://www.bottiglieriadelmassimo.it/wp-content/uploads/2022/06/E79D95B1-9945-4845-8FC1-6C297D0B4E58.jpeg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'TEQUILA' },
  { id: 76, nombre: 'TEQUILA JOSE CUERVO TRADICIONAL REPOSADO 750 ML', precio: 180000, imagen: 'https://www.bottiglieriadelmassimo.it/wp-content/uploads/2022/06/E79D95B1-9945-4845-8FC1-6C297D0B4E58.jpeg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'TEQUILA' },
  { id: 77, nombre: 'TEQUILA OLMECA REPOSADO 350 ML', precio: 80000, imagen: 'https://main-cdn.sbermegamarket.ru/big2/hlr-system/-19/837/412/711/223/131/2/100025554591b0.png', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'TEQUILA' },
  { id: 78, nombre: 'TEQUILA OLMECA REPOSADO 700 ML', precio: 160000, imagen: 'https://batavialiquor.com/73-thickbox_default/tequila-olmeca-reposado-750ml.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'TEQUILA' },
  { id: 79, nombre: 'TRIDENT PAQUETE', precio: 3000, imagen: 'https://m.media-amazon.com/images/I/91HbqPLfJrL._SL1500_.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'DULCES' },
  { id: 80, nombre: 'VIVE 100', precio: 4500, imagen: 'https://www.vitacost.com/acrobatpro/images/common/brand/rivo_veevee_energy_100.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 18, categoria: 'BEBIDAS ENERGIZANTES' },
  { id: 81, nombre: 'VODKA ABSOLUT 375 ML', precio: 90000, imagen: 'https://i.pinimg.com/736x/bb/2b/59/bb2b59597394d74cac79cc230f5b7a6c.jpg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'VODKA' },
  { id: 82, nombre: 'VODKA ABSOLUT 750 ML', precio: 150000, imagen: 'https://cs13.pikabu.ru/images/big_size_comm/2021-03_5/1616302774181537945.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 1, categoria: 'VODKA' },
  { id: 83, nombre: 'WHISKY BUCHANANS 375 ML', precio: 160000, imagen: 'https://i5.walmartimages.com/seo/Buchanan-s-DeLuxe-Aged-12-Years-Blended-Scotch-Whisky-375-mL-40-ABV_30b4f30f-e387-4381-b5d9-b3b388e1b566.9415aba03a110865e14cc3ccda15642f.jpeg', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'WHISKY' },
  { id: 84, nombre: 'WHISKY BUCHANANS 750 ML', precio: 250000, imagen: 'https://vivanda.vteximg.com.br/arquivos/ids/183014-1000-1000/20023280.jpg?v=637225181366930000', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'WHISKY' },
  { id: 85, nombre: 'WHISKY JACK DANIELS 700 ML', precio: 200000, imagen: 'https://whiskyworld.ru/upload/resize_cache/webp/upload/iblock/ce3/ce3ce7eb790cfab904e26f292d26c0f5.webp', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'WHISKY' },
  { id: 86, nombre: 'WHISKY RED LABEL SELLO ROJO 375 ML', precio: 100000, imagen: 'https://regstaer.ru/upload/resize_cache/iblock/c26/600_800_1/c2604fdf82722af0332d3262e794d6e7.jpg', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 2, categoria: 'WHISKY' },
  { id: 87, nombre: 'WHISKY RED LABEL SELLO ROJO 700 ML', precio: 160000, imagen: 'https://www.naughtygrapett.com/wp-content/uploads/2021/09/Johnnie_Walker_Red_Label_Scotch_Whisky_750ml_11440002_1-min.png', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 3, categoria: 'WHISKY' },
  { id: 88, nombre: 'WHISKY SPECIAL 350 ML', precio: 90000, imagen: 'https://drinkcentral.co/wp-content/uploads/2023/03/WHISKY-SOMETHING-SPECIAL-MEDIA-350ml.webp', disponibilidad: 'PRODUCTO_AGOTADO', existencias: 0, categoria: 'WHISKY' },
  { id: 89, nombre: 'WHISKY SPECIAL 750 ML', precio: 150000, imagen: 'https://vivanda.vtexassets.com/arquivos/ids/469581/36450.jpg?v=638379342449670000', disponibilidad: 'PRODUCTO_DISPONIBLE', existencias: 1, categoria: 'WHISKY' },
];

// --- Centralized State Management for Products ---
class ProductStore {
    private static instance: ProductStore;
    private products: Product[] = [...initialProducts];
    private nextProductId = 1;
    private listeners: ((products: Product[]) => void)[] = [];

    private constructor() {
        this.nextProductId = this.products.reduce((maxId, product) => Math.max(product.id, maxId), 0) + 1;
    }

    public static getInstance(): ProductStore {
        if (!ProductStore.instance) {
            ProductStore.instance = new ProductStore();
        }
        return ProductStore.instance;
    }

    private broadcast() {
        this.listeners.forEach(listener => listener(this.products));
    }

    public subscribe(listener: (products: Product[]) => void): () => void {
        this.listeners.push(listener);
        listener(this.products);
        return () => {
            this.listeners = this.listeners.filter(l => l !== listener);
        };
    }

    public getProducts(): Product[] {
        return this.products;
    }

    public addProduct(productData: Omit<Product, 'id'>): void {
        const newProduct: Product = {
            ...productData,
            id: this.nextProductId++,
        };
        this.products = [...this.products, newProduct];
        this.broadcast();
    }

    public updateProduct(productId: number, updatedData: Partial<Omit<Product, 'id'>>): void {
        this.products = this.products.map(product =>
            product.id === productId ? { ...product, ...updatedData } : product
        );
        this.broadcast();
    }
}

const productStoreInstance = ProductStore.getInstance();

export const addProduct = (productData: Omit<Product, 'id'>): void => {
    productStoreInstance.addProduct(productData);
};

export const updateProduct = (productId: number, updatedData: Partial<Omit<Product, 'id'>>): void => {
    productStoreInstance.updateProduct(productId, updatedData);
};

export function useProducts() {
    const [products, setProducts] = useState(productStoreInstance.getProducts());

    useEffect(() => {
        const unsubscribe = productStoreInstance.subscribe(newProducts => {
            setProducts([...newProducts]);
        });

        return () => unsubscribe();
    }, []);

    return { products };
}

// Keep the old export for compatibility where it might still be used.
export const mockProducts = productStoreInstance.getProducts();

