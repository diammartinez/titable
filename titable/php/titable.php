<?php
//Habilita la notificación de todos los errores.
error_reporting(E_ALL);
//Configura la visualización de errores en pantalla.
ini_set('display_errors', 'On');

// Recibe el JSON enviado desde JavaScript
$data = file_get_contents('php://input');
$data = json_decode($data, true);

// Función para obtener una conexión PDO
function getPDOConnection($host, $user, $password, $db)
{
  // Conexión a la base de datos (debes configurar esto adecuadamente)
  try {
    $pdo = new PDO("mysql:host=$host;dbname=$db", $user, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    return $pdo;
  } catch (PDOException $e) {
    die("Error en la conexión a la base de datos primaria: " . $e->getMessage());
  }
}

// Decodifica el JSON de 'setupObj'
if (isset($data['setupObj'])) {
  $setupObj = json_decode($data['setupObj'], true);
}


if ($data) {
  // var_dump($data);
  try {
    // Se establece la conexion con los valores enviados
    // Accede a los valores individuales
    // Acceder a propiedades específicas del objeto 'cnn'
    $host = $setupObj['cnn']['host'];
    $user = $setupObj['cnn']['user'];
    $password = $setupObj['cnn']['password'];
    $db = $setupObj['cnn']['db'];
    $table =    $setupObj['cnn']['table'];

    // crea la conexion
    $pdo = getPDOConnection($host, $user, $password, $db);
    $output['cnn'] = $setupObj['cnn'];

    // Crea 2 arreglos para contener las columnas y los valores
    $columns = array();
    $values = array();
    // Crea el arreglo $params que se usa para pasar los valores al execute del PDO
    $params = array();
    // $output['params'] = $params;
    $pagina = isset($setupObj['pagina']) ? intval($setupObj['pagina']) : 1;
    // $pagina = isset($_POST['pagina']) ? intval($_POST['pagina']) : 1;
    $regPorPagina = isset($setupObj['regPorPagina']) ? intval($setupObj['regPorPagina']) : 10;
    $hasta = $regPorPagina; // Número de registros por página
    $inicio = ($pagina - 1) * $hasta; // Cálculo del desplazamiento

    // Recorre el array fieldsObj para obtener los nombre de las columnas
    foreach ($setupObj['fieldsObj'] as $valor) {
      $columns[] = $valor;
      $values[] = ":$valor";
    }

    //une los datos del arreglo $columns en una cadena separada por comas 
    $fieldNames = implode(", ", $columns);
    //une los datos del arreglo $values en una cadena separada por comas 
    $fieldValues = implode(", ", $values);

    $output['columns'] = $columns;
    $output['values'] = $values;
    $output['params'] = $params;
    $output['tabla'] = $table;

    // Si where es "" WHERE es "", sino se crea la cadena WHERE para sumarla a la consulta
    $where = $setupObj['where'] == "" ? "" : " {$setupObj['where']}";
    // Consulta SQL INSERT para el primer objeto
    $sql = "SELECT $fieldNames FROM {$table}{$where} ORDER BY {$setupObj['orderBy']} {$setupObj['orderDirection']} LIMIT $inicio, $hasta";
    // $sql = "SELECT $fieldNames FROM {$setupObj['tabla']}{$where} ORDER BY {$setupObj['orderBy']} {$setupObj['orderDirection']} LIMIT $inicio, $hasta";

    $output['sql'] = $sql;

    $statement = $pdo->prepare($sql);
    // Se pasa el array asociativo $params con los valores correspondientes
    $statement->execute($params);

    // Obtiene el número de filas devueltas por la consulta
    $num_rows = $statement->rowCount();
    $output['recordsFound'] = $num_rows;

    // Consulta SQL con el recuento total
    $sqlTotal = "SELECT COUNT(*) AS total FROM {$table}{$where}";
    // $sqlTotal = "SELECT COUNT(*) AS total FROM {$setupObj['tabla']}{$where}";
    $statementTotal = $pdo->prepare($sqlTotal);
    $statementTotal->execute($params);

    // Obtiene el recuento total
    $totalRows = $statementTotal->fetch(PDO::FETCH_ASSOC)['total'];

    $output['totalRecords'] = $totalRows;

    // Si la consulta devuelve por lo menos 1 registro
    if ($num_rows >= 1) {

      foreach ($statement as $row) {
        $miArray = [];
        foreach ($columns as $campo) {
          $miArray[$campo] = $row[$campo];
        }
        $output["resJson"][] = $miArray;
      }
      $output['status'] = "ok";
    } else {
      $output['status'] = "nofiles";
      $output["resJson"] = [];
    }
    $output['params'] = $params;
  } catch (PDOException $e) {
    $output['PDOException'] = "Error en la conexión a la base de datos: " . $e->getMessage();
  }
} else {
  $output['errorJSON'] =  "Datos JSON no válidos";
}

echo json_encode($output, JSON_UNESCAPED_UNICODE);
