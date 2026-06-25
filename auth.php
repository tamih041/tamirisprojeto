<?php
require_once 'config.php';

$action = $_POST['action'] ?? '';

if ($action === 'registrar') {
    $email = trim($_POST['email'] ?? '');
    $senha = $_POST['senha'] ?? '';
    if (!filter_var($email, FILTER_VALIDATE_EMAIL)) json_out(['error' => 'E-mail inválido.']);
    if (strlen($senha) < 6) json_out(['error' => 'Senha mínima: 6 caracteres.']);
    try {
        $st = db()->prepare('SELECT id FROM usuarios WHERE email = ?');
        $st->execute([$email]);
        if ($st->fetch()) json_out(['error' => 'E-mail já cadastrado.']);
        $hash = password_hash($senha, PASSWORD_BCRYPT);
        $st = db()->prepare('INSERT INTO usuarios (email, senha) VALUES (?, ?)');
        $st->execute([$email, $hash]);
        $_SESSION['user_id'] = db()->lastInsertId();
        $_SESSION['email']   = $email;
        json_out(['ok' => true, 'email' => $email]);
    } catch (Exception $e) {
        json_out(['error' => 'Erro interno: ' . $e->getMessage()]);
    }
}

if ($action === 'login') {
    $email = trim($_POST['email'] ?? '');
    $senha = $_POST['senha'] ?? '';
    try {
        $st = db()->prepare('SELECT id, senha FROM usuarios WHERE email = ?');
        $st->execute([$email]);
        $user = $st->fetch();
        if (!$user || !password_verify($senha, $user['senha']))
            json_out(['error' => 'E-mail ou senha incorretos.']);
        $_SESSION['user_id'] = $user['id'];
        $_SESSION['email']   = $email;
        json_out(['ok' => true, 'email' => $email]);
    } catch (Exception $e) {
        json_out(['error' => 'Erro interno: ' . $e->getMessage()]);
    }
}

if ($action === 'logout') {
    session_destroy();
    json_out(['ok' => true]);
}

if ($action === 'sessao') {
    json_out(!empty($_SESSION['user_id'])
        ? ['ok' => true, 'email' => $_SESSION['email']]
        : ['ok' => false]);
}

json_out(['error' => 'Ação inválida.'], 400);
