<?php
error_reporting(E_ALL);
ini_set('display_errors', 1);
header("Access-Control-Allow-Origin: *");
header("Access-Control-Allow-Headers: *");
header("Access-Control-Allow-Methods: *");

require '../vendor/autoload.php';


include 'DbConnect.php';
$objDb = new DbConnect;
$conn = $objDb->connect();

$method = $_SERVER['REQUEST_METHOD'];


function generateTempPassword()
{
    $chars = '0123456789abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ';

    $tempPassword = '';
    for ($i = 0; $i < 8; $i++) {
        $tempPassword .= $chars[rand(0, strlen($chars) - 1)];
    }


    return $tempPassword;
}

switch ($method) {
    case "GET":
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if (isset($path[2]) && $path[2] == 'tables') {
            $sql = "SHOW TABLES";
            $stmt = $conn->prepare($sql);
            $stmt->execute();
            $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
        } else {
            $sql = "SELECT * FROM users";

            if (isset($path[3]) && is_numeric($path[3])) {
                $sql .= " WHERE id = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $path[3]);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
            } else {
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
            }
        }
        echo json_encode($result);
        break;
    case "POST":
        //$data = json_decode(file_get_contents('php://input'));
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if (isset($path[2]) && $path[2] == 'user' && $path[3] == 'create') {
            $user = json_decode(file_get_contents('php://input'));
            $created_at = date('Y-m-d');
            $firstName = $user->firstName;
            $lastName = $user->lastName;
            $mobile = filter_var($user->mobile, FILTER_SANITIZE_NUMBER_INT);
            $email = filter_var($user->email, FILTER_SANITIZE_EMAIL);
            $password = password_hash($user->password, PASSWORD_DEFAULT);
            $user_type =  $user->user_type;
            $active =  $user->active;


            $sql = "SELECT * FROM users WHERE email = :email";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);



            if (!$result) {


                $sql = "INSERT INTO users(id, firstName, lastName, mobile, email, password, user_type, active, created_at) VALUES(null, :firstName, :lastName, :mobile, :email, :password, :user_type, :active, :created_at)";

                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':firstName', $firstName);
                $stmt->bindParam(':lastName', $lastName);
                $stmt->bindParam(':mobile', $mobile);
                $stmt->bindParam(':email', $email);
                $stmt->bindParam(':password', $password);
                $stmt->bindParam(':user_type', $user_type);
                $stmt->bindParam(':active', $active);
                $stmt->bindParam(':created_at', $created_at);

                if ($stmt->execute()) {
                    $sql = "SELECT * FROM users WHERE email = :email";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(':email', $email);
                    $stmt->execute();
                    $result = $stmt->fetch(PDO::FETCH_ASSOC);
                    if ($result) {
                        $id = $result['id']; // o id do usuário é obtido a partir do resultado da consulta ao banco de dados
                        $path = "../usersDocs/$id"; // caminho onde a pasta será criada

                        if (!file_exists($path)) { // verifica se a pasta já existe
                            mkdir($path, 0775, true); // cria a pasta com permissão de leitura e escrita para o usuário e grupo, e leitura para outros
                        }
                        if ($user_type != 'UF') {
                            $to = $user->email; // endereço de email do destinatário
                            $subject = "Suas credenciais de acesso"; // assunto do email
                            $message = "Olá, seu email de login é:" .
                                $user->email . " e sua senha é: " . $user->password; // corpo do email
                            $headers = "From: seuemail@seudominio.com"; // cabeçalhos do email

                            // envia o email
                            mail($to, $subject, $message, $headers);
                        }
                    }

                    $response = ['status' => 1, 'message' => 'Cadastro efetuado com sucesso.'];
                } else {
                    $response = ['status' => 0, 'message' => 'Erro ao cadastrar.'];
                }
            } else {
                $response = ['status' => 0, 'message' => 'Usuário ja cadastrado.'];
            }

            echo json_encode($response);

            break;
        }
        if ($path[2] && $path[2] == 'user' && $path[3] == 'login') {
            $user = json_decode(file_get_contents('php://input'));
            $sql = "SELECT * FROM users WHERE email = :email";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $user->email);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                // Verifica se a senha digitada pelo usuário é válida
                if (password_verify($user->password, $result['password'])) {
                    // Inicia a sessão e armazena os dados do usuário
                    session_start();
                    $_SESSION['user_id'] = $result['id'];
                    $_SESSION['name'] = $result['firstName'];
                    $_SESSION['email'] = $result['email'];
                    $_SESSION['user_type'] = $result['user_type'];
                    $response = ['status' => 1, 'user_type' => $result['user_type'], 'message' => 'Usuário logado com sucesso.', 'logged_id' => $result['id']];
                } else {
                    $response = ['status' => 0, 'message' => 'Senha inválida.'];
                }
            } else {
                $response = ['status' => 0, 'message' => 'Usuário não encontrado.'];
            }

            echo json_encode($response);

            break;
        }


        if ($path[2] && $path[2] == 'user' && $path[3] == 'get') {
            if (isset($path[4]) && $path[4] == 'all') {
                $sql = "SELECT * FROM users";
                $stmt = $conn->prepare($sql);
                $stmt->execute();
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);
                $response = ['status' => 1, 'message' => 'dados acessados', 'user_data' => $result];
                echo json_encode($response);
            } else {
                $user = json_decode(file_get_contents('php://input'));
                $sql = "SELECT * FROM users WHERE id = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':id', $user);
                $stmt->execute();
                $result = $stmt->fetch(PDO::FETCH_ASSOC);
                $response = ['status' => 1, 'message' => 'dados acessados', 'nome' => $result['firstName'], 'user_data' => $result];
                echo json_encode($response);
            }

            break;
        }


        if (isset($path[2]) && $path[2] == 'user' && $path[3] == 'forgot') {
            $email = json_decode(file_get_contents('php://input'), true);

            $sql = "SELECT * FROM users WHERE email = :email";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':email', $email['email']);
            $stmt->execute();
            $result = $stmt->fetch(PDO::FETCH_ASSOC);

            if ($result) {
                $id = $result['id']; // o id do usuário é obtido a partir do resultado da consulta ao banco de dados
                $tempPassword = generateTempPassword(); // gera uma senha temporária
                $hashedTempPassword = password_hash($tempPassword, PASSWORD_DEFAULT); // criptografa a senha temporária

                $sql = "UPDATE users SET password = :hashedTempPassword WHERE id = :id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':hashedTempPassword', $hashedTempPassword);
                $stmt->bindParam(':id', $id);
                if ($stmt->execute()) {
                    $to = $email['email']; // endereço de email do destinatário
                    $subject = "Recuperação de senha"; // assunto do email
                    $message = "Sua senha temporária é: $tempPassword. Use-a para fazer login e, em seguida, altere sua senha para uma senha de sua escolha."; // corpo do email
                    $headers = "From: seuemail@seudominio.com"; // cabeçalhos do email

                    // envia o email
                    mail($to, $subject, $message, $headers);

                    $response = ['status' => 1, 'message' => 'Email de recuperação de senha enviado com sucesso.'];
                } else {
                    $response = ['status' => 0, 'message' => 'Erro ao enviar email de recuperação de senha.'];
                }
            } else {
                $response = ['status' => 0, 'message' => 'Email não cadastrado.'];
            }

            echo json_encode($response);

            break;
        }



        if (
            $path[2] == 'user' && $path[3] == 'update'
        ) {
            $user = json_decode(file_get_contents('php://input'));
            $firstName = $user->firstName;
            $lastName = $user->lastName;
            $mobile = filter_var($user->mobile, FILTER_SANITIZE_NUMBER_INT);
            $email = filter_var($user->email, FILTER_SANITIZE_EMAIL);
            $password = $user->password;
            $user_id = $user->user_id;
            $active = $user->active;

            $updatePassword = false;
            if (!empty($password)) {
                $password = password_hash(
                    $password,
                    PASSWORD_DEFAULT
                );
                $updatePassword = true;
            }

            $sql = "UPDATE users SET firstName = :firstName, lastName = :lastName, mobile = :mobile, email = :email, active = :active";
            if ($updatePassword) {
                $sql .= ", password = :password";
            }
            $sql .= " WHERE id = :user_id";

            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':firstName', $firstName);
            $stmt->bindParam(':lastName', $lastName);
            $stmt->bindParam(':mobile', $mobile);
            $stmt->bindParam(':email', $email);
            $stmt->bindParam(':active', $active);
            if ($updatePassword) {
                $stmt->bindParam(':password', $password);
            }
            $stmt->bindParam(':user_id', $user_id);

            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Atualização efetuada com sucesso.'];

                $to = $email;
                $subject = "Dados atualizados";
                $message = "Seus dados foram atualizados com sucesso.\n\n";
                $message .= "Nome: $firstName $lastName\n";
                $message .= "Número de telefone: $mobile\n";
                $message .= "Email: $email\n";
                $message .= "Ativo: $active\n";
                if ($updatePassword) {
                    $message .= "Senha: $password\n";
                }
                $headers = "From: no-reply@example.com\r\n";
                mail($to, $subject, $message, $headers);
            } else {
                $response = ['status' => 0, 'message' => 'Erro ao atualizar.'];
            }

            echo json_encode($response);

            break;
        }






        if ($path[2] && $path[2] == 'projects' && $path[3] == 'get') {
            // Lê os dados enviados pelo cliente
            $data = json_decode(file_get_contents('php://input'), true);
            $response = "";

            // Verifica se o ID do projeto foi passado
            if (isset($data['user_id'])) {
                // Cria a consulta SQL para selecionar o projeto
                $sql = "SELECT * FROM projects WHERE user_id = :id";

                // Prepara a consulta
                $stmt = $conn->prepare($sql);

                // Vincula o parâmetro ao valor
                $stmt->bindParam(
                    ':id',
                    $data['user_id']
                );


                // Executa a consulta
                $stmt->execute();

                // Armazena o resultado da consulta em um array
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Verifica se o projeto foi encontrado
                if ($result) {
                    // Envia os dados do projeto de volta para o cliente
                    $response = [
                        'status' => 1,
                        'message' => 'Projeto encontrado',
                        'project' => $result,
                        /* 'user_type' => $_SESSION['user_type'] */
                    ];
                } else {
                    // Envia uma mensagem de erro para o cliente
                    $response = [
                        'status' => 0,
                        'message' => 'Projeto não encontrado',
                        'project' => $data['user_id']
                    ];
                }
            }

            if (isset($data['all']) == true) {
                // Cria a consulta SQL para selecionar o projeto
                $sql = "SELECT * FROM projects";

                // Prepara a consulta
                $stmt = $conn->prepare($sql);

                // Vincula o parâmetro ao valor


                // Executa a consulta
                $stmt->execute();

                // Armazena o resultado da consulta em um array
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Verifica se o projeto foi encontrado
                if ($result) {
                    // Envia os dados do projeto de volta para o cliente
                    $response = [
                        'status' => 1,
                        'message' => 'Projeto encontrado',
                        'project' => $result,
                        /*  'user_type' => $_SESSION['user_type'] */
                    ];
                } else {
                    // Envia uma mensagem de erro para o cliente
                    $response = [
                        'status' => 0,
                        'message' => 'Projeto não encontrado',
                        'project' => $data['user_id']
                    ];
                }
            }
            if (isset($data['project_id'])) {
                // Cria a consulta SQL para selecionar o projeto
                $sql = "SELECT * FROM projects WHERE id = :id";

                // Prepara a consulta
                $stmt = $conn->prepare($sql);

                // Vincula o parâmetro ao valor
                $stmt->bindParam(
                    ':id',
                    $data['project_id']
                );


                // Executa a consulta
                $stmt->execute();

                // Armazena o resultado da consulta em um array
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Verifica se o projeto foi encontrado
                if ($result) {
                    // Envia os dados do projeto de volta para o cliente
                    $response = [
                        'status' => 1,
                        'message' => 'Projeto encontrado',
                        'project' => $result,
                        /*  'user_type' => $_SESSION['user_type'] */
                    ];
                } else {
                    // Envia uma mensagem de erro para o cliente
                    $response = [
                        'status' => 0,
                        'message' => 'Projeto não encontrado',
                        'project' => $data['user_id']
                    ];
                }
            }

            // Envia a resposta em formato JSON
            echo json_encode($response);
            break;
        }


        if (
            isset($path[2]) && $path[2] == 'projects' && isset($path[3]) && $path[3] == 'get'
            && isset($path[4]) && $path[4] == 'public'
        ) {
            // Lê os dados enviados pelo cliente
            $response = [
                'status' => 'n/a',
                'message' => 'debug',
                'info' => $data
            ];
            $data = json_decode(file_get_contents('php://input'), true);

            echo json_encode($response);
            // Verifica se o ID do projeto foi passado

            if (($data['project_id'])) {
                // Cria a consulta SQL para selecionar o projeto
                $sql = "SELECT * FROM projects WHERE id = :id";

                // Prepara a consulta
                $stmt = $conn->prepare($sql);

                // Vincula o parâmetro ao valor
                $stmt->bindParam(
                    ':id',
                    $data['project_id']
                );


                // Executa a consulta
                $stmt->execute();

                // Armazena o resultado da consulta em um array
                $result = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Verifica se o projeto foi encontrado
                if ($result) {
                    // Envia os dados do projeto de volta para o cliente
                    $response = [
                        'status' => 1,
                        'message' => 'Projeto encontrado',
                        'project' => $result,
                        /*  'user_type' => $_SESSION['user_type'] */
                    ];
                    echo json_encode($response);
                } else {
                    // Envia uma mensagem de erro para o cliente
                    $response = [
                        'status' => 0,
                        'message' => 'Projeto não encontrado',
                        'project' => $data['user_id']
                    ];
                    echo json_encode($response);
                }
            } else {
                $response = [
                    'status' => 'n/a',
                    'message' => 'debug',
                    'info' => $data
                ];
                echo json_encode($response);
            }

            // Envia a resposta em formato JSON

            break;
        }


        if ($path[2] === 'projects' && $path[3] === 'assign') {
            // Lê os dados enviados pelo cliente
            $data = json_decode(file_get_contents('php://input'), true);

            // Verifica se o ID do projeto e o ID do usuário foram passados
            if (($data['projectId']) && ($data['userId'])) {
                // Cria a consulta SQL para atribuir o projeto ao usuário
                $sql = "UPDATE projects SET user_id = :userId WHERE id = :projectId";

                // Prepara a consulta
                $stmt = $conn->prepare($sql);

                // Vincula os parâmetros aos valores
                $stmt->bindParam(
                    ':userId',
                    $data['userId']
                );
                $stmt->bindParam(':projectId', $data['projectId']);

                // Executa a consulta
                $stmt->execute();

                // Verifica se a consulta foi bem-sucedida
                if (
                    $stmt->rowCount() > 0
                ) {
                    // Envia uma mensagem de sucesso para o cliente
                    $response = [
                        'status' => 1,
                        'message' => 'Projeto atribuído com sucesso'
                    ];
                } else {
                    // Envia uma mensagem de erro para o cliente
                    $response = [
                        'status' => 0,
                        'message' => 'Erro ao atribuir projeto',
                        'info' => [
                            'error' => $stmt,
                            'data' => $data
                        ]
                    ];
                }
            } else {
                // Envia uma mensagem de erro para o cliente
                $response = [
                    'status' => 0,
                    'message' => 'O ID do projeto e/ou o ID do usuário não foram passados'
                ];
            }

            // Envia a resposta em formato JSON
            echo json_encode($response);
            break;
        }



        if ($path[2] && $path[2] == 'projects' && $path[3] == 'create') {
            // Lê os dados enviados pelo cliente
            $data = json_decode(file_get_contents('php://input'), true);

            // Verifica se os dados obrigatórios foram passados
            if (($data['user_id']) && ($data['title']) && ($data['description']) && ($data['latitude']) && ($data['longitude'])) {
                // Define as variáveis com os valores passados pelo cliente
                $user_id = filter_var($data['user_id'], FILTER_SANITIZE_NUMBER_INT);
                $title = $data['title'];
                $description = $data['description'];
                $latitude = filter_var($data['latitude'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                $longitude = filter_var($data['longitude'], FILTER_SANITIZE_NUMBER_FLOAT, FILTER_FLAG_ALLOW_FRACTION);
                $proponent = $data['proponent'];
                $street_address = $data['street_address'];
                $city_address = $data['city_address'];
                $state_address = $data['state_address'];
                $project_type = $data['project_type'];
                $methodology = $data['methodology'];
                $raee = $data['raee'];
                $hectares = $data['hectares'];
                $CP = $data['CP'];
                $project_status = "Em validação";
                $folder_path = "../usersDocs/$user_id";



                // Cria a consulta SQL para inserir o novo projeto na tabela
                $sql = "INSERT INTO projects (user_id, title, proponent, street_address, city_address, state_address, description, project_type, methodology, raee, latitude, longitude, project_status, folder_path, hectares, CP ) VALUES (:user_id, :title, :proponent, :street_address, :city_address, :state_address, :description, :project_type, :methodology, :raee, :latitude, :longitude, :project_status, :folder_path, :hectares, :CP)";


                // Prepara a consulta
                $stmt = $conn->prepare($sql);

                // Vincula os parâmetros aos valores
                $stmt->bindParam(':user_id', $user_id);
                $stmt->bindParam(':title', $title);
                $stmt->bindParam(':proponent', $proponent);
                $stmt->bindParam(':street_address', $street_address);
                $stmt->bindParam(':city_address', $city_address);
                $stmt->bindParam(':state_address', $state_address);
                $stmt->bindParam(':description', $description);
                $stmt->bindParam(':project_type', $project_type);
                $stmt->bindParam(':methodology', $methodology);
                $stmt->bindParam(':raee', $raee);
                $stmt->bindParam(':latitude', $latitude);
                $stmt->bindParam(':longitude', $longitude);
                $stmt->bindParam(':project_status', $project_status);
                $stmt->bindParam(':folder_path', $folder_path);
                $stmt->bindParam(':hectares', $hectares);
                $stmt->bindParam(':CP', $CP);


                // Executa a consulta
                $stmt->execute();

                // Verifica se a consulta foi executada com sucesso
                if ($stmt->rowCount() > 0) {
                    // Retorna uma mensagem de sucesso
                    $project_id = $conn->lastInsertId();
                    $code = sprintf('%05d', $user_id) . sprintf('%05d', $project_id);
                    if (!is_dir($folder_path . '/' . $project_id)) {
                        mkdir($folder_path . '/' . $project_id);
                    }

                    $sql = "UPDATE projects SET code = :code WHERE id = :id";
                    $stmt = $conn->prepare($sql);
                    $stmt->bindParam(
                        ':code',
                        $code
                    );
                    $stmt->bindParam(':id', $project_id);
                    $stmt->execute();

                    $response = ['status' => 1, 'message' => 'Projeto criado com sucesso', 'project_id' => $project_id, 'code' => $code];
                } else {
                    // Retorna uma mensagem de erro
                    $response = ['status' => 0, 'message' => 'Erro ao criar projeto'];
                }
            } else {
                // Retorna uma mensagem de erro
                $response = ['status' => 0, 'message' => 'Dados obrigatórios não foram passados'];
            }

            // Envia a resposta ao cliente
            echo json_encode($response);
            break;
        }

        if (
            $path[2] && $path[2] == 'projects' && $path[3] == 'sendnew'
        ) {
            // Lê os dados enviados pelo cliente
            $data = json_decode(file_get_contents('php://input'), true);

            // Verifica se os dados obrigatórios foram passados
            if (($data['title']) && ($data['description'])) {
                // Define as variáveis com os valores passados pelo cliente
                $user_id = 00;
                $title = $data['title'];
                $description = $data['description'];
                $latitude = 15;
                $longitude = 15;
                $proponent = $data['proponent'];
                $street_address = "";
                $city_address = "";
                $state_address = "";
                $project_type = "";
                $methodology = "";
                $raee = "";
                $hectares = "";
                $project_status = "Em validação";
                $code = "waiting";
                $folder_path = "";



                // Cria a consulta SQL para inserir o novo projeto na tabela
                $sql = "INSERT INTO projects (user_id, title, proponent, street_address, city_address, state_address, description, project_type, methodology, raee, latitude, longitude, project_status, folder_path, hectares, code ) VALUES (:user_id, :title, :proponent, :street_address, :city_address, :state_address, :description, :project_type, :methodology, :raee, :latitude, :longitude, :project_status, :folder_path, :hectares, :code)";


                // Prepara a consulta
                $stmt = $conn->prepare($sql);

                // Vincula os parâmetros aos valores
                $stmt->bindParam(':user_id', $user_id);
                $stmt->bindParam(':title', $title);
                $stmt->bindParam(':proponent', $proponent);
                $stmt->bindParam(':street_address', $street_address);
                $stmt->bindParam(':city_address', $city_address);
                $stmt->bindParam(':state_address', $state_address);
                $stmt->bindParam(':description', $description);
                $stmt->bindParam(':project_type', $project_type);
                $stmt->bindParam(':methodology', $methodology);
                $stmt->bindParam(':raee', $raee);
                $stmt->bindParam(':latitude', $latitude);
                $stmt->bindParam(':longitude', $longitude);
                $stmt->bindParam(':project_status', $project_status);
                $stmt->bindParam(':folder_path', $folder_path);
                $stmt->bindParam(':hectares', $hectares);
                $stmt->bindParam(':code', $code);


                // Executa a consulta
                $stmt->execute();

                // Verifica se a consulta foi executada com sucesso
                if ($stmt->rowCount() > 0) {
                    // Retorna uma mensagem de sucesso


                    $response = ['status' => 1, 'message' => 'Projeto criado com sucesso'];
                } else {
                    // Retorna uma mensagem de erro
                    $response = ['status' => 0, 'message' => 'Erro ao criar projeto'];
                }
            } else {
                // Retorna uma mensagem de erro
                $response = ['status' => 0, 'message' => 'Dados obrigatórios não foram passados'];
            }

            // Envia a resposta ao cliente
            echo json_encode($response);
            break;
        }


        // verifica se existe o caminho e se é uma atualização de projeto
        if ($path[3] == 'update' && $path[2] == 'projects') {
            // Lê os dados enviados pelo cliente
            $data = json_decode(file_get_contents('php://input'), true);
            //echo json_encode($data);
            //echo json_encode($data['project_id']);
            if (($data['user_id'])) {


                $user_id = filter_var($data['user_id'], FILTER_SANITIZE_NUMBER_INT);
                $project_id = filter_var($data['project_id'], FILTER_SANITIZE_NUMBER_INT);
                $title = $data['title'];
                $proponent
                    = $data['proponent'];
                $street_address = $data['street_address'];
                $city_address = $data['city_address'];
                $state_address = $data['state_address'];
                $description = $data['description'];
                $project_type = $data['project_type'];
                $methodology = $data['methodology'];
                $hectares = $data['hectares'];
                $raee = $data['raee'];
                $latitude = $data['latitude'];
                $longitude = $data['longitude'];
                $project_status = $data['project_status'];
                $CP = $data['CP'];


                // Inserir o projeto no banco de dados
                $query = "UPDATE projects SET user_id = :user_id, title = :title, proponent = :proponent, street_address = :street_address, city_address = :city_address, state_address = :state_address, description = :description, project_type = :project_type, methodology = :methodology, hectares = :hectares, raee = :raee, project_status = :project_status, latitude = :latitude, longitude = :longitude, CP = :CP WHERE id = :project_id";
                $update = $conn->prepare($query);
                $update->bindParam(':user_id', $user_id);
                $update->bindParam(':project_id', $project_id);
                $update->bindParam(':title', $title);
                $update->bindParam(':proponent', $proponent);
                $update->bindParam(':street_address', $street_address);
                $update->bindParam(':city_address', $city_address);
                $update->bindParam(':state_address', $state_address);
                $update->bindParam(':description', $description);
                $update->bindParam(':project_type', $project_type);
                $update->bindParam(':methodology', $methodology);
                $update->bindParam(':hectares', $hectares);
                $update->bindParam(':raee', $raee);
                $update->bindParam(':latitude', $latitude);
                $update->bindParam(':longitude', $longitude);
                $update->bindParam(':project_status', $project_status);
                $update->bindParam(':CP', $CP);
                $update->execute();

                if ($update->rowCount() == 1) {
                    // Retorna uma mensagem de sucesso
                    $response = [
                        'status' => 1,
                        'message' => 'Projeto atualizado com sucesso'
                    ];
                } else {
                    // Retorna uma mensagem de erro
                    $response = [
                        'status' => '1',
                        'message' => 'Nada foi atualizado',
                        'info' => [
                            'error' => $update,
                            'data' => $data,
                            'update' => $update->rowCount()
                        ]
                    ];
                }
            }
            echo json_encode($response);

            break;
        }
        if (isset($path[4]) && $path[4] == 'get' && isset($path[2]) && $path[2] == 'projects') {
            $userId = $path[5];
            $folderPath = '../usersDocs/' . $userId . '/' . $path[6] . '/' . $path[3];
            $response = array();
            if (is_dir($folderPath)) {
                // Obtém a lista de arquivos dentro da pasta
                $files = scandir($folderPath);
                // Remove os elementos "." e ".." do array
                $files = array_diff($files, array('.', '..'));
                // Cria um array com os nomes dos arquivos
                $fileNames = array();

                foreach ($files as $file) {
                    if (pathinfo($file, PATHINFO_EXTENSION) == "pdf") {
                        $fileNames[] = $file;
                    }
                }



                // Obtém os projetos correspondentes ao usuário especificado
                $sql = "SELECT * FROM projects WHERE user_id = :user_id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(':user_id', $userId);
                $stmt->execute();
                $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Cria um array para armazenar as informações de arquivos e projetos

                $response['files'] = $fileNames;
                $response['projects'] = $projects;


                // Exibe o array de nomes de arquivos e projetos
                echo json_encode($response);
            } else {
                // Exibe um array com uma mensagem de erro
                $response = array(
                    'Dados obrigatórios não foram passados', 'pasta nao encontrada'
                );
                echo json_encode($response);
            }
            break;
        }
        
        if (isset($path[3]) && $path[3] == 'pdfbuild' && isset($path[2]) && $path[2] == 'projects') {
            try {
                if (headers_sent()) {
                    throw new Exception("FPDF error: Some data has already been output, can't send PDF file.");
                }

                header("Content-type: application/pdf");
                header("Content-Disposition: inline; filename='Relatório_CCV.pdf'");

                $userDocsPath = '../usersDocs/' . $path[4] . '/' . $path[5];
                $clientPdfPath = $userDocsPath . '/clientPdf/Relatório-UF-CCV.pdf';
                $pdfFilesPath = $userDocsPath . '/**/*';
                $outputPath = $userDocsPath . '/final';
                $pdfFiles = glob($pdfFilesPath);

                if (empty($pdfFiles)) {
                    // Tratar a ausência de arquivos a serem mesclados
                    exit();
                }

                // Verificar se a pasta de destino existe e, se não existir, criá-la
                if (!is_dir($outputPath)) {
                    mkdir($outputPath, 0777, true);
                }

                // Iniciar a instância do FPDI
                $pdf = new \setasign\Fpdi\Fpdi();

                // Adicionar o arquivo do cliente ao PDF
                $clientPdfFile = glob($clientPdfPath);
                if (!empty($clientPdfFile)) {
                    $pageCount = $pdf->setSourceFile($clientPdfFile[0]);
                    for ($i = 1; $i <= $pageCount; $i++) {
                        $tpl = $pdf->importPage($i);
                        $pdf->AddPage();
                        $pdf->useTemplate($tpl);
                    }
                }

                // Adicionar cada arquivo restante ao PDF
                foreach ($pdfFiles as $file) {
                    if ($file === $clientPdfPath || strpos($file, $outputPath) !== false) {
                        continue;
                    }

                    $pageCount = $pdf->setSourceFile($file);
                    for ($i = 1; $i <= $pageCount; $i++) {
                        $tpl = $pdf->importPage($i);
                        $pdf->AddPage();
                        $pdf->useTemplate($tpl);
                    }
                }

                // Gerar e salvar o PDF
                $filePath = $outputPath . '/Relatório-AT-CCV.pdf';
                $pdfUrl = 'usersDocs/' . $path[4] . '/' . $path[5] . '/' . 'final' . '/Relatório-AT-CCV.pdf';
                $response = array();
                $response = ['status' => 1, 'pathPdf' => $pdfUrl];
                echo json_encode($response);
                $pdf->Output("F", $filePath);
            } catch (Exception $e) {

                // Tratar a exceção adequadamente
                error_log($e->getMessage());
            } finally {
                exit();
            }
        }




        /*  if (
            isset($path[4]) && $path[4] == 'get' && isset($path[2]) && $path[2] == 'projects'
        ) {
            $userId = $path[5];
            $folderPath = '../usersDocs/' . $userId . '/' . $path[6] . '/' . $path[3];
            if (is_dir($folderPath)) {
                // Obtém a lista de arquivos dentro da pasta
                $files = scandir($folderPath);
                // Remove os elementos "." e ".." do array
                $files = array_diff($files, array('.', '..'));
                // Cria um array com os nomes dos arquivos
                $fileNames = array();
                foreach ($files as $file) {
                    if (isset($path[7]) && $path[7] == 'all') {
                        $folderPath = '../' . 'usersDocs/' . $userId . '/' . $path[6] . '/' . $path[3];
                        $pdfFile = $folderPath . '/' . $file;
                        $imageFile = str_replace('.pdf', '.png', $pdfFile);

                        $imagick = new \Imagick();
                        $imagick->readImage($pdfFile);
                        $imagick->setImageFormat("png");
                        $imagick->writeImage($imageFile);

                        $images[] = $imageFile;
                    } else {
                        $images[] = $file;
                    }
                }

                // Obtém os projetos correspondentes ao usuário especificado
                $sql = "SELECT * FROM projects WHERE user_id = :user_id";
                $stmt = $conn->prepare($sql);
                $stmt->bindParam(
                    ':user_id',
                    $userId
                );
                $stmt->execute();
                $projects = $stmt->fetchAll(PDO::FETCH_ASSOC);

                // Cria um array para armazenar as informações de arquivos e projetos
                $response = array();
                $response['files'] = $fileNames;
                $response['projects'] = $projects;
                $response['images'] = $images;

                // Exibe o array de nomes de arquivos e projetos
                echo json_encode($response);
            } else {
                // Exibe um array com uma mensagem de erro
                $response = array(
                    'Dados obrigatórios não foram passados', 'pasta nao encontrada'
                );
                echo json_encode($response);
            }
            break;
        } */





        if (isset($path[2]) && $path[2] == 'projects' && isset($path[3]) && $path[3] == 'search') {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                echo json_encode(array('message' => 'Method not allowed.'));
                break;
            }

            $data = json_decode(file_get_contents('php://input'), true);
            $code = isset($data['code']) ? $data['code'] : '';
            $title = isset($data['title']) ? $data['title'] : '';
            $proponent = isset($data['proponent']) ? $data['proponent'] : '';
            $street_address = isset($data['street_address']) ? $data['street_address'] : '';
            $city_address = isset($data['city_address']) ? $data['city_address'] : '';
            $state_address = isset($data['state_address']) ? $data['state_address'] : '';
            $project_type = isset($data['project_type']) ? $data['project_type'] : '';
            $methodology = isset($data['methodology']) ? $data['methodology'] : '';
            $project_status = isset($data['project_status']) ? $data['project_status'] : '';
            $CP = isset($data['CP']) ? $data['CP'] : '';

            $query = "SELECT * FROM projects WHERE 1";

            if ($title) {
                $query .= " AND title LIKE '%$title%'";
            }
            if ($code) {
                $query .= " AND code LIKE '%$code%'";
            }
            if ($proponent) {
                $query .= " AND proponent LIKE '%$proponent%'";
            }
            if ($state_address) {
                $query .= " AND state_address = '$state_address'";
            }
            if ($project_type) {
                $query .= " AND project_type = '$project_type'";
            }
            if ($methodology) {
                $query .= " AND methodology = '$methodology'";
            }
            if ($project_status) {
                $query .= " AND project_status = '$project_status'";
            }
            if ($CP) {
                $query .= " AND CP = '$CP'";
            }

            $result = $conn->prepare($query);
            $result->execute();
            $projects = array();

            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $projects[] = $row;
            }

            header('Content-Type: application/json');
            if (count($projects) > 0) {
                echo json_encode($projects);
            } else {
                echo json_encode(array('message' => 'Nenhum projeto encontrado.'));
            }
            break;
        }

        if (isset($path[2]) && $path[2] == 'users' && isset($path[3]) && $path[3] == 'search') {
            if ($_SERVER['REQUEST_METHOD'] !== 'POST') {
                http_response_code(405);
                echo json_encode(array('message' => 'Method not allowed.'));
                break;
            }

            $data = json_decode(file_get_contents('php://input'), true);
            $firstName = isset($data['firstName']) ? $data['firstName'] : '';
            $lastName = isset($data['lastName']) ? $data['lastName'] : '';
            $mobile = isset($data['mobile']) ? $data['mobile'] : '';
            $email = isset($data['email']) ? $data['email'] : '';
            $user_type = isset($data['user_type']) ? $data['user_type'] : '';
            $active = isset($data['active']) ? $data['active'] : '';


            $query = "SELECT * FROM users WHERE 1";

            if ($firstName) {
                $query .= " AND firstName LIKE '%$firstName%'";
            }
            if ($lastName) {
                $query .= " AND lastName LIKE '%$lastName%'";
            }
            if ($mobile) {
                $query .= " AND mobile LIKE '%$mobile%'";
            }
            if ($email) {
                $query .= " AND email LIKE '%$email%'";
            }
            if ($user_type) {
                $query .= " AND user_type = '$user_type'";
            }
            if ($active) {
                $query .= " AND active = '$active'";
            }


            $result = $conn->prepare($query);
            $result->execute();
            $filteredUsers = array();

            while ($row = $result->fetch(PDO::FETCH_ASSOC)) {
                $filteredUsers[] = $row;
            }

            header('Content-Type: application/json');
            if (count($filteredUsers) > 0) {
                echo json_encode($filteredUsers);
            } else {
                echo json_encode(array('message' => 'Nenhum Usuário Encontrado.'));
            }
            break;
        }




        if ($path[2] && $path[2] == 'projects' && $path[4] == 'delete') {
            $userId = $path[5];
            $fileName = urldecode($path[6]);
            $filePath = '../usersDocs/' . $userId . '/' . $path[7] . '/' . $path[3] . '/' . $fileName;
            if (is_file($filePath)) {
                // Exclui o arquivo
                unlink($filePath);
                // Exibe uma mensagem de sucesso
                echo json_encode(array('status' => 1, 'message' => 'Arquivo excluído com sucesso'));
            } else {
                // Exibe uma mensagem de erro
                echo json_encode(array('status' => 0, 'message' => 'Erro ao excluir o arquivo'));
            }
            break;
        }

        if (
            $path[2] && $path[2] == 'projects' && $path[4] == 'rename'
        ) {
            $userId = $path[5];
            $fileName = urldecode($path[6]);
            $filePath = '../usersDocs/' . $userId . '/' . $path[7] . '/' . $path[3] . '/' . $fileName;
            $body = file_get_contents('php://input');
            $data = json_decode($body);
            $newFileName = $data->name;

            if ($newFileName) {
                // Renomeia o arquivo
                $newFilePath = '../usersDocs/' . $userId . '/' . $path[7] . '/' . $path[3] . '/' .  str_replace(' ', '-',  $newFileName);
                rename($filePath, $newFilePath);
                echo json_encode(array('status' => 1, 'message' => 'Arquivo renomeado com sucesso'));
            } else {
                // Exibe uma mensagem de erro
                echo json_encode(array('status' => 0, 'message' => 'Erro ao renomear o arquivo', 'error' => is_file($filePath)));
            }
            break;
        }


        // Verifica se o arquivo foi enviado via POST
        if (
            $path[2]

            && $path[4] == 'files'
            && $path[5] == 'upload'
            && $path[2] == 'projects'
            && $path[7]
        ) {

            $pathFolderUser = '../usersDocs/' . $path[6];
            $pathFolder = '../usersDocs/' . $path[6] . '/' . $path[7];

            $pathFile = '../usersDocs/' . $path[6] . '/' . $path[7] . '/' . $path[3];

            if (!is_dir($pathFolder)) {
                mkdir($pathFolder);
            }

            if (!is_dir($pathFile)) {
                mkdir($pathFile);
            }

            if (isset($_FILES['files'])) {
                $files = $_FILES['files'];
            } /* else {
                $response = ['status' => 0, 'message' => 'O arquivo deve ser um PDF'];
                echo json_encode($response);
                return;
            } */
            // Armazena os dados do arquivo em variáveis
            $fileName =
                str_replace(' ', '-',  $files['name']);
            $fileTempName = $files['tmp_name'];
            $fileSize = $files['size'];
            $fileError = $files['error'];
            $fileType = $files['type'];




            if ($fileError === 0) {
                $fileInfo = pathinfo($fileName);
                $extension = strtolower($fileInfo['extension']);

                if (
                    $extension !== 'pdf'
                ) {
                    // Retornar uma mensagem de erro, pois o arquivo não é um PDF
                    $response = ['status' => 0, 'message' => 'O arquivo deve ser um PDF', 'fileInfo' => $fileInfo];
                    echo json_encode($response);
                    return;
                }
                //
                if ($fileSize < 100000000) {

                    move_uploaded_file($fileTempName, $pathFile . '/' . $fileName);
                    // Retorna uma mensagem de sucesso
                    $response = ['status' => 1, 'message' => 'Arquivos enviados com sucesso', 'path' => $path[7], 'res' => $_FILES['files'], 'fileInfo' => $fileInfo];
                } else {
                    // Retorna uma mensagem de erro
                    $response = ['status' => 0, 'message' => 'O arquivo é muito grande'];
                }
            } else {
                // Retorna uma mensagem de erro
                $response = ['status' => 0, 'message' => 'Ocorreu um erro no upload do arquivo'];
            }


            echo json_encode($response);
            break;
        }




        if ($path[2] && $path[2] == 'projects' && $path[3] == 'delete') {
            // Obtém o ID do projeto a ser excluído
            $project_id = $path[4];

            // Construa a consulta de exclusão
            $sql = "DELETE FROM projects WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $project_id);

            // Executa a consulta
            if ($stmt->execute()) {
                // Verifica se o projeto ainda existe no banco de dados
                $check_sql = "SELECT id FROM projects WHERE id = :id";
                $check_stmt = $conn->prepare($check_sql);
                $check_stmt->bindParam(':id', $project_id);
                $check_stmt->execute();
                $project = $check_stmt->fetch(PDO::FETCH_ASSOC);

                if (!$project) {
                    $response = ['status' => 1, 'message' => 'Record deleted successfully.', 'pID' => $project_id];
                    unset($_SESSION['project']); // remove o projeto do local storage
                } else {
                    $response = ['status' => 0, 'message' => 'Failed to delete record.'];
                }
            } else {
                $response = ['status' => 0, 'message' => 'Failed to delete record.'];
            }
            echo json_encode($response);
            break;
        }






















    case "PUT":
        $user = json_decode(file_get_contents('php://input'));
        $sql = "UPDATE users SET name= :name, email =:email, mobile =:mobile, updated_at =:updated_at WHERE id = :id";
        $stmt = $conn->prepare($sql);
        $updated_at = date('Y-m-d');
        $stmt->bindParam(':id', $user->id);
        $stmt->bindParam(':name', $user->name);
        $stmt->bindParam(':email', $user->email);
        $stmt->bindParam(':mobile', $user->mobile);
        $stmt->bindParam(':updated_at', $updated_at);

        if ($stmt->execute()) {
            $response = ['status' => 1, 'message' => 'Record updated successfully.'];
        } else {
            $response = ['status' => 0, 'message' => 'Failed to update record.'];
        }
        echo json_encode($response);
        break;

    case "DELETE":
        /*  $sql = "DELETE FROM users WHERE id = :id";
        $path = explode('/', $_SERVER['REQUEST_URI']);
        if (isset($path[2]) && $path[2] == 'tables') {
            $sql = "DROP TABLE " . $path[3];
            $stmt = $conn->prepare($sql);
            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Record created successfully.'];
            } else {
                $response = ['status' => 0, 'message' => 'Failed to create record.'];
            }
            echo json_encode($response);
            break;
        } else {
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $path[3]);

            if ($stmt->execute()) {
                $response = ['status' => 1, 'message' => 'Record deleted successfully.'];
            } else {
                $response = ['status' => 0, 'message' => 'Failed to delete record.'];
            }
            echo json_encode($response);
            break;
        }
 */
        if (isset($path[2]) && $path[2] == 'projects') {
            // Obtém o ID do projeto a ser excluído
            $project_id = $path[3];

            // Construa a consulta de exclusão
            $sql = "DELETE FROM projects WHERE id = :id";
            $stmt = $conn->prepare($sql);
            $stmt->bindParam(':id', $project_id);

            // Executa a consulta
            if ($stmt->execute()) {
                // Verifica se o projeto ainda existe no banco de dados
                $check_sql = "SELECT id FROM projects WHERE id = :id";
                $check_stmt = $conn->prepare($check_sql);
                $check_stmt->bindParam(':id', $project_id);
                $check_stmt->execute();
                $project = $check_stmt->fetch(PDO::FETCH_ASSOC);

                if (!$project) {
                    $response = ['status' => 1, 'message' => 'Record deleted successfully.', 'pID' => $project_id];
                    unset($_SESSION['project']); // remove o projeto do local storage
                } else {
                    $response = ['status' => 0, 'message' => 'Failed to delete record.'];
                }
            } else {
                $response = ['status' => 0, 'message' => 'Failed to delete record.'];
            }
            echo json_encode($response);
            break;
        }
}
