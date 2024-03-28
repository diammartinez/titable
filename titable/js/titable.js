class Titable {
  constructor(parametros) {
    this.containerId = parametros.container;
    this.columnas = parametros.columns;
    this.iconos = parametros.icons;
    this.iconFunction = parametros.iconFunction;
    this.cnn = parametros.cnn;
    this.tabla = parametros.cnn.table;
    this.regPorPagina = parametros.cnn.recordsPerPage;
    this.listeners = {}; // Array para guardar los eventListener
  }

  // Método para añadir un escuchador de eventos.  eventType es el tipo de evento que se desea escuchar, y callback, es la función que se debe llamar cuando se dispare el evento.
  addEventListener(eventType, callback) {
    // Comprueba si ya existe un array de escuchadores de eventos para el tipo de evento eventType en la propiedad listeners de la instancia de la clase. Si no existe, crea un nuevo array vacío para ese tipo de evento.
    if (!this.listeners[eventType]) {
      this.listeners[eventType] = [];
    }
    // Agrega la función callback al array de escuchadores de eventos para el tipo de evento eventType. Esto significa que cuando se dispare el evento eventType, todas las funciones en este array se ejecutarán en orden.
    this.listeners[eventType].push(callback);
    console.log(this.listeners);
  }

  // Método para disparar un evento. eventType, es el tipo de evento., data, es un dato adicional que se pasa con el evento.
  fireEvent(eventType, data) {
    // Comprueba si hay algún escuchador de eventos registrado para el tipo de evento
    if (this.listeners[eventType]) {
      // Si hay escuchadores de eventos registrados para eventType, se recorre cada uno
      this.listeners[eventType].forEach((callback) => {
        // Se llama a cada función de escucha (callback) con el argumento data.
        callback(data);
      });
    }
  }

  updateTable() {
    console.log("ACTUALIZACION DE DATOS");
  }

  crearTabla() {
    // Se asigna a la const tablaContainer el elemento que contendra la tabla
    const tablaContainer = document.getElementById(this.containerId);

    // Se crean los DATA- que se van a usar en la funcion de busqueda
    tablaContainer.dataset.buscar = "";
    tablaContainer.dataset.regPorPagina = this.regPorPagina;
    tablaContainer.dataset.pagina = 1;
    tablaContainer.dataset.ordercol = 0;
    tablaContainer.dataset.ordertype = "DESC";

    const containerTitable = document.createElement("div");
    containerTitable.classList.add("container-titable");

    // crea el div que va a contener la cabecera de la tabla y le agrega la clase
    const tableHeader = document.createElement("div");
    tableHeader.classList.add("table-header");

    // crea un div y le asigna la clase flex-items y le agrega la clase
    const flexItem1 = document.createElement("div");
    flexItem1.classList.add("flex-items");
    flexItem1.classList.add("flexItem1");

    // crea un segundo div se le asigna la clase flex-items, y se lo deja vacio
    const flexItem2 = document.createElement("div");
    flexItem2.classList.add("flex-items");
    flexItem2.classList.add("flexItem2");

    // Se crea la etiqueta "Buscar"
    const buscarLabel = document.createElement("label");
    buscarLabel.setAttribute("for", "campoBuscar");
    buscarLabel.textContent = "Buscar";

    // Se crea el DIV donde va a ir el campod busqueda
    const searchInputDiv = document.createElement("div");
    searchInputDiv.classList.add("searchInputDiv");

    // Se crea el elemento INPUT de busqueda
    const searchInput = document.createElement("input");
    searchInput.type = "text";
    searchInput.name = "buscar";
    searchInput.id = `${this.containerId}-campoBuscar`;
    searchInput.classList.add("titable-input-search");

    // Agregar evento KEYUP al campo buscar
    searchInput.addEventListener("keyup", () => {
      // Se iguala a 1 la PAGINA para comenzar la busqueda
      document.querySelector("#" + this.containerId).dataset.pagina = 1;

      // Setea el atributo data-buscar con el contenido del campo de busqueda
      document.querySelector("#" + this.containerId).dataset.buscar =
        searchInput.value;
      this.getData(this.containerId);
      // this.getData(this.containerId);
    });

    // Se crea la "X" del campo de busqueda
    const searchInputX = document.createElementNS(
      "http://www.w3.org/2000/svg",
      "svg"
    );
    searchInputX.setAttribute("xmlns", "http://www.w3.org/2000/svg");
    searchInputX.setAttribute("viewBox", "0 0 24 24");
    searchInputX.classList.add("search-input-x");
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute(
      "d",
      "m16.192 6.344-4.243 4.242-4.242-4.242-1.414 1.414L10.535 12l-4.242 4.242 1.414 1.414 4.242-4.242 4.243 4.242 1.414-1.414L13.364 12l4.242-4.242z"
    );
    searchInputX.appendChild(path);
    searchInputDiv.appendChild(searchInput);
    searchInputDiv.appendChild(searchInputX);

    // Agregar evento clic al icono "X" del campo buscar (limpia el campo de busqueda)
    searchInputX.addEventListener("click", () => {
      // Se borra el valor del input
      searchInput.value = "";
      // Se setea el atributo data-buscar con el valor del input
      document.querySelector("#" + this.containerId).dataset.buscar =
        searchInput.value;
      // Se pone el foco sobre el input
      searchInput.focus();
      // Una vez limpio elcampo se llama a la function de busqueda
      this.getData(this.containerId);
    });

    // Se agregan los elementos creados al tercer DIV
    flexItem2.appendChild(buscarLabel);
    flexItem2.appendChild(searchInputDiv);

    // Se agregan los 3 elemntos flex-items' al header creado primeramente
    tableHeader.appendChild(flexItem1);
    tableHeader.appendChild(flexItem2);

    // Se agreaa el header al contenedor de la tabla
    containerTitable.appendChild(tableHeader);

    // Se crea el DIV donde va a ir la tabla
    const xTable = document.createElement("div");
    xTable.classList.add("xtable");

    // Se crea la tabla
    const tabla = document.createElement("table");
    // Se crea el thead de la tabla
    const thead = document.createElement("thead");
    // Se crea la fila donde se va a colocar el encabezado de l tabla
    const theadFila = document.createElement("tr");

    // Con un FOR se recorre el arreglo de columnas y se crea el encabezado
    for (let j = 0; j < this.columnas.length + 1; j++) {
      // si esta vacio o es null cresar la columna de iconos
      if (this.columnas[j] == "" || this.columnas[j] == null) {
        const celdaThIcon = document.createElement("th");
        celdaThIcon.textContent = "Opciones";
        // Agrega la celda creada a la TR de encabezados
        theadFila.appendChild(celdaThIcon);
      } else {
        // Si no crear una columna normal
        const celdaTh = document.createElement("th");
        celdaTh.classList.add("sort");
        celdaTh.classList.add("ASC");
        // Convierte el nombre de la columna para que la primera letra sea mayuscula
        celdaTh.textContent =
          this.columnas[j].charAt(0).toUpperCase() + this.columnas[j].slice(1);
        // Agregar evento clic a cada celdaTh
        celdaTh.addEventListener("click", () => {
          // Setea el atributo data-orderCol segun la columna clickleada
          // Con su indice
          document.querySelector("#" + this.containerId).dataset.ordercol =
            celdaTh.cellIndex;

          // Setea el atributo data-ordertype
          // Si la celda contiene la clse "ASC"...setea el data-ordertype del contenedor
          if (celdaTh.classList.contains("ASC")) {
            document.querySelector("#" + this.containerId).dataset.ordertype =
              "ASC";
            celdaTh.classList.remove("ASC");
            celdaTh.classList.add("DESC");
          } else {
            document.querySelector("#" + this.containerId).dataset.ordertype =
              "DESC";
            celdaTh.classList.remove("DESC");
            celdaTh.classList.add("ASC");
          }

          // Llama a la afuncion de busqueda despues de hacer clic en una columna
          this.getData(this.containerId);
        });

        // Agrega la celda creada a la TR de encabezados
        theadFila.appendChild(celdaTh);
      }
    }

    // Agrega la fila de encabezados al THEAD
    thead.appendChild(theadFila);
    // Agrega el THEAD a la tabla
    tabla.appendChild(thead);

    // Se crea el TBODY de la tabla y se le da la clase "content-table"
    const tbody = document.createElement("tbody");
    tbody.classList.add("content-table");

    // Se agrega el TBODY a la tabla
    tabla.appendChild(tbody);

    // Se agrega la tabla al contenedor
    xTable.appendChild(tabla);

    // agrega la tabla al contenedor
    containerTitable.appendChild(xTable);
    // tablaWarp.appendChild(tabla);
    tablaContainer.appendChild(containerTitable);
    // tablaContainer.appendChild(tablaWarp);

    // Se crea el dIV que va a contener la paginacion
    const tablaPaginacion = document.createElement("div");
    tablaPaginacion.classList.add("tabla_paginacion");
    // Se escucha el click sobre "tabla_paginacion" para detectar los clicks en las paginas
    tablaPaginacion.addEventListener("click", (e) => {
      e.stopPropagation();
      // Si existe el taget y es un elemento A...
      if (e.target && e.target.tagName == "A") {
        // Setea el data-pagina del contenedor con el numero de pagina clickeado
        document.querySelector("#" + this.containerId).dataset.pagina =
          e.target.innerHTML;
        // Llama a la funcion  getData
        this.getData(this.containerId);
      }
    });

    // Se crea el primer DIV y se le da clase
    const flexItem4 = document.createElement("div");
    flexItem4.classList.add("flex-items");

    //Se cre la etiqueta para mostrar la cantidad de registros
    const lblTotal = document.createElement("label");
    lblTotal.id = "lbl-total";

    // Se agrega la etiqueta al DIv creado anteriormente
    flexItem4.appendChild(lblTotal);

    // Se crea el segundo DIV donde va el combo con la cantidad de registros a mostrar
    const flexItem5 = document.createElement("div");
    flexItem5.classList.add("flex-items");

    //Se crea la etiqueta y se le da atributos
    const labelNumRegistros = document.createElement("label");
    labelNumRegistros.setAttribute("for", "num_registros");
    labelNumRegistros.textContent = "Registros a mostrar";

    // Se crea el SELECT y se le da atributos
    const selectNumRegistros = document.createElement("select");
    selectNumRegistros.name = "num_registros";
    selectNumRegistros.id = "num_registros";
    selectNumRegistros.classList.add("select-css");

    // Se van creando las opciones del SELECT
    const option1 = document.createElement("option");
    option1.value = "10";
    option1.textContent = "10";
    const option2 = document.createElement("option");
    option2.value = "25";
    option2.textContent = "25";
    const option3 = document.createElement("option");
    option3.value = "50";
    option3.textContent = "50";
    const option4 = document.createElement("option");
    option4.value = "100";
    option4.textContent = "100";

    // Agregar evento CHANGE al combo numero de registros
    selectNumRegistros.addEventListener("change", () => {
      // Setea el atributo data-pagina a 1 para comenzar la busqueda
      document.querySelector("#" + this.containerId).dataset.regPorPagina =
        selectNumRegistros.value;

      // Setea el atributo data-pagina a 1 para comenzar la busqueda
      document.querySelector("#" + this.containerId).dataset.pagina = 1;

      // console.log("Numero de registros...");
      this.getData(this.containerId);
    });

    // Se agregan las opciones creads al SELECT
    selectNumRegistros.appendChild(option1);
    selectNumRegistros.appendChild(option2);
    selectNumRegistros.appendChild(option3);
    selectNumRegistros.appendChild(option4);
    // se setea el combo en el valor 25
    selectNumRegistros.value = this.regPorPagina;
    // selectNumRegistros.value = 10;
    // Se agregan la etiqueta y el SELECT al segundo DIV del pie de la tabla
    flexItem5.appendChild(labelNumRegistros);
    flexItem5.appendChild(selectNumRegistros);

    // Se crea un tercer DIV y se le da clase
    const flexItem6 = document.createElement("div");
    flexItem6.classList.add("flex-items");

    // Se crea un DIV para la apaginacion y se le colocan atributos
    const navPaginacion = document.createElement("div");
    navPaginacion.id = "nav-paginacion";

    // Agregar evento CLICK al DIV PAGINACION
    navPaginacion.addEventListener("click", (e) => {
      // Setea el atributo data-pagina a 1 para comenzar la busqueda

      e.preventDefault();
      // Si el TARGET del CLICK fue un A disparar la busqueda
      if (e.target && e.target.tagName == "A") {
        document.querySelector("#" + this.containerId).dataset.pagina =
          e.target.innerHTML;

        this.getData(this.containerId);
      }
    });

    flexItem6.appendChild(navPaginacion);

    // Se agregan los 3 DIVS creados al DIV de la PAGINACION
    tablaPaginacion.appendChild(flexItem4);
    tablaPaginacion.appendChild(flexItem5);
    tablaPaginacion.appendChild(flexItem6);

    // Se agregan el DIV de la paginacion al contenedor de la tabla
    containerTitable.appendChild(tablaPaginacion);

    // Una vez creado todo se llama a la function de busqueda
    this.getData(this.containerId);
  }

  /* Peticion AJAX */
  async getData(contenedor) {
    // Obtener los valores de los campos
    let elContenedor = document.querySelector(`#${contenedor}`);
    let pagina = elContenedor.dataset.pagina;
    let regPorPagina = elContenedor.dataset.regPorPagina;
    let orderByTemp = elContenedor.dataset.ordercol;

    // Obtiene el evalor del elemento pasado a la funcion
    const getValue = (idElemento) => document.querySelector(idElemento).value;
    const crud = "read";
    const search = getValue(`#${this.containerId}-campoBuscar`);
    const orderBy = this.columnas[orderByTemp];
    const orderDirection = elContenedor.dataset.ordertype;
    const limitStart = 0;
    const limitEnd = 50;
    const cnn = this.cnn;

    // Crear el primer objeto con los datos del paciente
    const fieldsObj = this.columnas;
    let idActual = "";

    // Crea la cadena WHERE creaando un array para las condiciones
    const whereConditions = [];

    // Crea un array para las condiciones LIKEs
    const orConditions = [];

    // Iterar sobre el objeto fieldsObj para las otras condiciones
    for (const field of fieldsObj) {
      // Convertir tanto el campo como el término de búsqueda a minúsculas para búsqueda insensible a mayúsculas y minúsculas
      const lowercaseField = field.toLowerCase();
      const lowercaseSearch = search.toLowerCase();

      orConditions.push(`${lowercaseField} LIKE '%${lowercaseSearch}%'`);
    }

    // Si hay condiciones OR, agregar la agrupación con paréntesis
    if (orConditions.length > 0) {
      whereConditions.push(`(${orConditions.join(" OR ")})`);
    }

    // Crear la cadena WHERE combinando todas las condiciones con AND
    const where =
      whereConditions.length > 0
        ? `WHERE ${whereConditions.join(" AND ")}`
        : "";

    // Crear el segundo objeto con la clave "tabla"
    const setupObj = {
      crud,
      where,
      search,
      fieldsObj,
      orderBy,
      orderDirection,
      regPorPagina,
      pagina,
      limitStart,
      limitEnd,
      cnn,
    };

    // Convertir el objeto setupObj a JSON
    const setupObjJSON = JSON.stringify(setupObj);

    try {
      // IMPORTANTE CORREGIR LA RUTA DEL ARCHIVO PHP
      const resPost = await fetch("titable/php/titable.php", {
        method: "POST",
        body: JSON.stringify({ setupObj: setupObjJSON }),
        headers: {
          "Content-Type": "application/json",
        },
      });

      // Espera que la consulta devuelva los resultados
      const response = await resPost.json();

      if (response.status == "ok") {
        // console.log("Lectura Ok");
        // Se crea data para contener los resultados devueltos por el servidor
        const data = response.resJson;
        // console.log(data);

        // Si la cantidad de registros devueltos en "data" es mayor/igual a 1
        if (data.length >= 1) {
          // Limpia el TBODY de la tabla
          document.querySelector(`#${contenedor} .content-table`).innerHTML =
            "";
          // recorre cada objeto (post.resJson) dentro del JSON devuelto por la funcion
          data.forEach((obj) => {
            // crea una nueva fila para cada objeto
            const fila = document.createElement("tr");
            // Obtiene el par clave/valor del objeto iterado
            Object.entries(obj).forEach(([key, value]) => {
              // Itera sobre las columnas obteniendo el nombre
              fieldsObj.forEach((columnName) => {
                // Compara el nombre de la columna con la KEY del objeto
                if (columnName == key) {
                  // Si columnName y key coinciden en "id" se asigna ese "value" a "idActual"
                  if (columnName == "id") {
                    idActual = value;
                  }
                  // Se crea un elemento TD con el valor VALUE y se lo agrega a la FILA
                  const celda = document.createElement("td");
                  celda.textContent = `${value}`;
                  fila.appendChild(celda);
                }
              });
            });
            // si en los parametros se enviaron iconos...
            if (this.iconos.length >= 1) {
              // Convierte la primera letra de la cedena (Nombre de las columnas) en mayuscula y quita la "s" final
              let iconTable =
                this.tabla.charAt(0).toUpperCase() + this.tabla.slice(1);
              // Verifica si la última letra es una "s" y la elimina
              if (iconTable.charAt(iconTable.length - 1) == "s") {
                iconTable = iconTable.slice(0, -1);
              }
              // Supongamos que tienes un elemento 'td' al que deseas agregar esta estructura
              // Itera el arreglo iconos los crea y los coloca en la fila
              let celda = document.createElement("td");
              this.iconos.forEach((icono) => {
                if (icono == "open") {
                  // Crea el primer enlace con clase 'drop-shadow edit-user'
                  let link = document.createElement("a");
                  link.href = "#";
                  link.className = "drop-shadow";
                  link.title = icono;
                  link.setAttribute("data-id", idActual);
                  link.setAttribute("data-command", "open");
                  // link.setAttribute("data-command", "open" + iconTable);

                  // Crear el elemento <svg> y configurar su atributo 'viewBox'
                  const svgElement = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg"
                  );
                  svgElement.setAttribute(
                    "xmlns",
                    "http://www.w3.org/2000/svg"
                  );
                  svgElement.setAttribute("viewBox", "0 0 24 24");

                  // Crear el primer elemento <path> y configurar su atributo 'd'
                  const path1Element = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                  );
                  path1Element.setAttribute(
                    "d",
                    "M12 9a3.02 3.02 0 0 0-3 3c0 1.642 1.358 3 3 3 1.641 0 3-1.358 3-3 0-1.641-1.359-3-3-3z"
                  );

                  // Crear el segundo elemento <path> y configurar su atributo 'd'
                  const path2Element = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                  );
                  path2Element.setAttribute(
                    "d",
                    "M12 5c-7.633 0-9.927 6.617-9.948 6.684L1.946 12l.105.316C2.073 12.383 4.367 19 12 19s9.927-6.617 9.948-6.684l.106-.316-.105-.316C21.927 11.617 19.633 5 12 5zm0 12c-5.351 0-7.424-3.846-7.926-5C4.578 10.842 6.652 7 12 7c5.351 0 7.424 3.846 7.926 5-.504 1.158-2.578 5-7.926 5z"
                  );

                  // Agregar los elementos <path> al elemento <svg>
                  svgElement.appendChild(path1Element);
                  svgElement.appendChild(path2Element);

                  link.appendChild(svgElement);
                  // Agrega los enlaces al elemento 'td'
                  celda.appendChild(link);
                  // Ahora, puedes agregar 'celda' a tu tabla o a cualquier otro lugar en el DOM
                  fila.appendChild(celda);
                } else if (icono == "mail") {
                  // Crear el elemento <a> y configurar sus atributos
                  let link = document.createElement("a");
                  link.href = "#";
                  link.className = "drop-shadow";
                  link.title = icono;
                  link.setAttribute("data-id", idActual);
                  link.setAttribute("data-command", "mail");
                  // link.setAttribute("data-command", "mail" + iconTable);

                  // Crear el elemento <svg> y configurar sus atributos
                  const svgElement = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg"
                  );
                  svgElement.setAttribute("width", "24");
                  svgElement.setAttribute("height", "24");
                  svgElement.setAttribute("viewBox", "0 0 24 24");
                  // svgElement.setAttribute(
                  // "style"
                  // "fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"
                  // );

                  // Crear el elemento <path> y configurar sus atributos
                  const pathElement = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                  );
                  pathElement.setAttribute(
                    "d",
                    "M20 4H4c-1.103 0-2 .897-2 2v12c0 1.103.897 2 2 2h16c1.103 0 2-.897 2-2V6c0-1.103-.897-2-2-2zm0 2v.511l-8 6.223-8-6.222V6h16zM4 18V9.044l7.386 5.745a.994.994 0 0 0 1.228 0L20 9.044 20.002 18H4z"
                  );

                  // Agregar el elemento <path> al elemento <svg>
                  svgElement.appendChild(pathElement);

                  // Agregar el elemento <svg> al elemento <a>
                  link.appendChild(svgElement);

                  // Agrega los enlaces al elemento 'td'
                  celda.appendChild(link);

                  // Agregar el elemento <a> al documento
                  fila.appendChild(celda);
                } else if (icono == "edit") {
                  // Crear el elemento <a> y configurar sus atributos
                  let link = document.createElement("a");
                  link.href = "#";
                  link.className = "drop-shadow";
                  link.title = icono;
                  link.setAttribute("data-id", idActual);
                  link.setAttribute("data-command", "edit");
                  // link.setAttribute("data-command", "edit" + iconTable);

                  // Crear el elemento <svg> y configurar sus atributos
                  const svgElement = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg"
                  );
                  svgElement.setAttribute("width", "24");
                  svgElement.setAttribute("height", "24");
                  svgElement.setAttribute("viewBox", "0 0 24 24");
                  // svgElement.setAttribute(
                  //   "style",
                  //   "fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"
                  // );

                  // Crear el elemento <path> y configurar su atributo 'd'
                  const pathElement = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                  );
                  pathElement.setAttribute(
                    "d",
                    "M19.045 7.401c.378-.378.586-.880.586-1.414s-.208-1.036-.586-1.414l-1.586-1.586c-.378-.378-.880-.586-1.414-.586s-1.036.208-1.413.585L4 13.585V18h4.413L19.045 7.401zm-3-3 1.587 1.585-1.59 1.584-1.586-1.585 1.589-1.584zM6 16v-1.585l7.04-7.018 1.586 1.586L7.587 16H6zm-2 4h16v2H4z"
                  );

                  // Agregar el elemento <path> al elemento <svg>
                  svgElement.appendChild(pathElement);

                  // Agregar el elemento <svg> al elemento <a>
                  link.appendChild(svgElement);

                  // Agrega los enlaces al elemento 'td'
                  celda.appendChild(link);

                  // Agregar el elemento <a> al documento
                  fila.appendChild(celda);
                } else if (icono == "records") {
                  // Crear el elemento <a> y configurar sus atributos
                  let link = document.createElement("a");
                  link.href = "#";
                  link.className = "drop-shadow";
                  link.title = icono;
                  link.setAttribute("data-id", idActual);
                  link.setAttribute("data-command", "records");
                  // link.setAttribute("data-command", "records" + iconTable);

                  // Crear el elemento <svg> y configurar sus atributos
                  const svgElement = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg"
                  );
                  svgElement.setAttribute("width", "24");
                  svgElement.setAttribute("height", "24");
                  svgElement.setAttribute("viewBox", "0 0 24 24");
                  // svgElement.setAttribute(
                  //   "style",
                  //   "fill: rgba(0, 0, 0, 1);transform: ;msFilter:;"
                  // );

                  // Crear el elemento <path> y configurar su atributo 'd'
                  const pathElement = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                  );
                  pathElement.setAttribute(
                    "d",
                    "m13.293 2.707.818.818L3.318 14.318C2.468 15.168 2 16.298 2 17.5s.468 2.332 1.318 3.183C4.169 21.532 5.299 22 6.5 22s2.331-.468 3.182-1.318L20.475 9.889l.818.818 1.414-1.414-8-8-1.414 1.414zm3.182 8.354-2.403-2.404-1.414 1.414 2.403 2.404-1.414 1.415-.99-.99-1.414 1.414.99.99-1.415 1.415-2.403-2.404L7 15.728l2.403 2.404-1.136 1.136c-.945.944-2.59.944-3.535 0C4.26 18.795 4 18.168 4 17.5s.26-1.295.732-1.768L15.525 4.939l3.535 3.535-2.585 2.587z"
                  );

                  // Agregar el elemento <path> al elemento <svg>
                  svgElement.appendChild(pathElement);

                  // Agregar el elemento <svg> al elemento <a>
                  link.appendChild(svgElement);

                  // Agrega los enlaces al elemento 'td'
                  celda.appendChild(link);

                  // Agregar el elemento <a> al documento
                  fila.appendChild(celda);
                } else if (icono == "delete") {
                  // Crear el elemento <a> y configurar sus atributos
                  let link = document.createElement("a");
                  link.href = "#";
                  link.className = "drop-shadow";
                  link.title = icono;
                  link.setAttribute("data-id", idActual);
                  link.setAttribute("data-command", "delete");
                  // link.setAttribute("data-command", "delete" + iconTable);

                  // Crear el elemento <svg> y configurar sus atributos
                  const svgElement = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "svg"
                  );
                  svgElement.setAttribute(
                    "xmlns",
                    "http://www.w3.org/2000/svg"
                  );
                  svgElement.setAttribute("viewBox", "0 0 24 24");

                  // Crear el primer elemento <path> y configurar su atributo 'd'
                  const path1Element = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                  );
                  path1Element.setAttribute(
                    "d",
                    "M5 20a2 2 0 0 0 2 2h10a2 2 0 0 0 2-2V8h2V6h-4V4a2 2 0 0 0-2-2H9a2 2 0 0 0-2 2v2H3v2h2zM9 4h6v2H9zM8 8h9v12H7V8z"
                  );

                  // Crear el segundo elemento <path> y configurar su atributo 'd'
                  const path2Element = document.createElementNS(
                    "http://www.w3.org/2000/svg",
                    "path"
                  );
                  path2Element.setAttribute("d", "M9 10h2v8H9zm4 0h2v8h-2z");

                  // Agregar los elementos <path> al elemento <svg>
                  svgElement.appendChild(path1Element);
                  svgElement.appendChild(path2Element);

                  // Agregar el elemento <svg> al elemento <a>
                  link.appendChild(svgElement);

                  // Agrega los enlaces al elemento 'td'
                  celda.appendChild(link);

                  // Agregar el elemento <a> al documento
                  fila.appendChild(celda);
                }
              });
            }
            // Una vez que se han creado todas las filas, agregamos el contenido de la tabla
            document
              .querySelector(`#${contenedor} .content-table`)
              .appendChild(fila);
          });

          // detecta los clicks sobre los iconos de las filas
          document
            .querySelector(`#${contenedor} .xtable table`)
            .addEventListener("click", (e) => {
              e.stopPropagation();
              // Se asegura que el elemento clickeado sea un A y tenga la clse drop-shadow y si lo es dispara la funcion correspondiente
              if (
                e.target &&
                e.target.tagName == "A" &&
                e.target.nodeType === 1 && //asegura que e.target sea un elemento del DOM.
                e.target.classList && //erifica que classList esté presente antes de intentar usar contains.
                e.target.classList.contains("drop-shadow")
              ) {
                this.iconFunction(e);
              }
            });
        }
      } else if (response.status == "nofiles") {
        // si no se encontraron resgistros
        // console.log("Registro no encontrado.");
        // Limpia el TBODY de la tabla
        document.querySelector(`#${contenedor} .content-table`).innerHTML = "";
      } else {
        console.log("Error en la lectura del registro: " + post.PDOException);
      }

      // Dsipara el evento
      this.fireEvent("queryfinished", {
        // event: "query_finished",
        response: response,
      });

      this.generarPaginacion(
        response.totalRecords,
        response.recordsFound,
        pagina,
        regPorPagina,
        response.valorBuscado
      );
    } catch (error) {
      console.log(error);
    }
    this.resaltarTextoEnTabla(this.containerId, search);
  }

  generarPaginacion(
    totalRegistros,
    totalFiltro,
    paginaActual,
    regPorPagina,
    valorBuscado
  ) {
    const totalPaginas = Math.ceil(totalRegistros / regPorPagina);
    let paginacionHTML = '<nav><ul class="pagination">';
    const elemContenedor = `#${this.containerId} .tabla_paginacion`;

    if (totalRegistros > 0) {
      // Calcular el rango de páginas a mostrar antes y después de la página actual
      let numeroInicio = Math.max(1, paginaActual - 4);
      const numeroFin = Math.min(totalPaginas, numeroInicio + 9);

      for (let i = numeroInicio; i <= numeroFin; i++) {
        if (i == paginaActual) {
          paginacionHTML += `<li class="page-item active"><a class="page-link" href="#">${i}</a></li>`;
        } else {
          paginacionHTML += `<li class="page-item"><a class="page-link" href="#">${i}</a></li>`;
        }
      }
      paginacionHTML += "</ul></nav>";

      document.querySelector(
        `${elemContenedor} .flex-items:nth-child(3)`
      ).innerHTML = paginacionHTML;
      document.querySelector(`${elemContenedor} #lbl-total`).textContent =
        "Registro(s) " +
        ((paginaActual - 1) * regPorPagina + 1) +
        " a " +
        ((paginaActual - 1) * regPorPagina + totalFiltro) +
        " de " +
        totalRegistros +
        " encontrados.";
    } else {
      document.querySelector(
        `${elemContenedor} .flex-items:nth-child(3)`
      ).innerHTML = "";
      document.querySelector(`${elemContenedor} #lbl-total`).textContent =
        "No se encontraron registros.";
    }
  }

  // Bsca y colorea un texto (sin distinción entre mayúsculas y minúsculas) en la tabla
  resaltarTextoEnTabla(tablaId, texto) {
    // return;
    // Si en campo de busqueda tiene por lo menos un caracter correrla funcion
    if (texto.length >= 1) {
      const tabla = document.getElementById(tablaId);
      const filas = tabla.getElementsByTagName("tr");

      // Convierte el texto de búsqueda a minúsculas para que sea insensible a mayúsculas/minúsculas
      const textoMinusculas = texto.toLowerCase();

      for (let i = 1; i < filas.length; i++) {
        // Empezamos desde 1 para omitir la fila de encabezado
        const celdas = filas[i].getElementsByTagName("td");

        for (let j = 0; j < celdas.length; j++) {
          const celda = celdas[j];
          const contenido = celda.textContent || celda.innerText;

          // Convierte el contenido de la celda a minúsculas para que sea insensible a mayúsculas/minúsculas
          const contenidoMinusculas = contenido.toLowerCase();

          if (contenidoMinusculas.includes(textoMinusculas)) {
            // Resalta el texto utilizando CSS
            celda.innerHTML = contenido.replace(
              new RegExp(texto, "gi"),
              '<span class="resaltado">$&</span>'
            );
          }
        }
      }
    }
  }
}
