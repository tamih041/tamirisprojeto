<?php
// Configurações de Banco de Dados via Variáveis de Ambiente (Seguro para Vercel)
define('DB_HOST', getenv('DB_HOST') ?: 'localhost');
define('DB_NAME', getenv('DB_NAME') ?: 'jsguard');
define('DB_USER', getenv('DB_USER') ?: 'root');
define('DB_PASS', getenv('DB_PASS') ?: '');
define('DB_PORT', getenv('DB_PORT') ?: '3306');

ini_set('session.cookie_httponly', 1);
ini_set('session.use_strict_mode', 1);
session_start();

function db(): PDO {
    static $pdo;
    if (!$pdo) {
        try {
            // Se houver um socket definido (como no Termux), usa socket. Caso contrário, TCP/IP padrão.
            $socket = getenv('DB_SOCKET');
            if ($socket) {
                $dsn = "mysql:unix_socket={$socket};dbname=" . DB_NAME . ";charset=utf8mb4";
            } else {
                $dsn = "mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";dbname=" . DB_NAME . ";charset=utf8mb4";
            }
            
            $pdo = new PDO($dsn, DB_USER, DB_PASS, [
                PDO::ATTR_ERRMODE => PDO::ERRMODE_EXCEPTION,
                PDO::ATTR_DEFAULT_FETCH_MODE => PDO::FETCH_ASSOC,
                PDO::ATTR_PERSISTENT => true
            ]);
        } catch (PDOException $e) {
            json_out(['error' => 'Erro de conexão com o banco: ' . $e->getMessage()], 500);
        }
    }
    return $pdo;
}

function json_out(array $data, int $code = 200): void {
    http_response_code($code);
    header('Content-Type: application/json');
    echo json_encode($data, JSON_UNESCAPED_UNICODE);
    exit;
}

function auth_required(): array {
    if (empty($_SESSION['user_id']))
        json_out(['error' => 'Não autenticado.'], 401);
    return ['id' => $_SESSION['user_id'], 'email' => $_SESSION['email']];
}
