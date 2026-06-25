<?php
require_once 'config.php';
auth_required();

$action = $_POST['action'] ?? '';

if ($action === 'ofuscar') {
    $codigo = trim($_POST['codigo'] ?? '');
    if (!$codigo) json_out(['error' => 'Código vazio.']);

    // ── Camada 1: Base64 ──────────────────────────────────────────────────────
    $b64 = base64_encode($codigo);

    // ── Camada 2: Junk code ───────────────────────────────────────────────────
    $junk = '';
    for ($i = 0; $i < 8; $i++) {
        $name = '_0x' . bin2hex(random_bytes(3));
        $val  = bin2hex(random_bytes(4));
        $junk .= "var {$name}=function(){return'{$val}';};\n";
    }

    // ── Camada 3: Nomes de funções ofuscados ──────────────────────────────────
    $decFn  = '_0x' . bin2hex(random_bytes(3));
    $evalFn = '_0x' . bin2hex(random_bytes(3));
    $keyVar = '_0x' . bin2hex(random_bytes(3));
    $dbgFn  = '_0x' . bin2hex(random_bytes(3));

    // ── Camada 4: Self-defending ──────────────────────────────────────────────
    $selfDefend = "var {$dbgFn}=function(){try{(function(){}).constructor('debugger')();}catch(_e){}};setInterval({$dbgFn},100);";

    // ── Camada 5: Anti-tamper ─────────────────────────────────────────────────
    $antiTamper = "try{Object['defineProperty'](window,'console',{get:function(){return{log:function(){},warn:function(){},error:function(){},table:function(){},dir:function(){}}}});}catch(_e){}";

    // ── Camada 6: String split para dificultar busca ──────────────────────────
    $b64chunks = str_split($b64, 40);
    $b64parts  = array_map(fn($c) => json_encode($c), $b64chunks);
    $b64expr   = implode('+', $b64parts);

    // ── Camada 7: Wrapper IIFE com múltiplas camadas ──────────────────────────
    $resultado  = "!function(){\n";
    $resultado .= "'use strict';\n";
    $resultado .= $selfDefend . "\n";
    $resultado .= $antiTamper . "\n";
    $resultado .= $junk;
    $resultado .= "var {$keyVar}=" . $b64expr . ";\n";
    $resultado .= "var {$decFn}=function(_s){try{return decodeURIComponent(escape(atob(_s)));}catch(_e){return _s;}};\n";
    $resultado .= "var {$evalFn}=function(_c){return(new Function(_c))();};\n";
    $resultado .= "{$evalFn}({$decFn}({$keyVar}));\n";
    $resultado .= "}();";

    // Salva histórico
    try {
        $u  = auth_required();
        $st = db()->prepare('INSERT INTO historico (usuario_id, tamanho_original, tamanho_ofuscado) VALUES (?,?,?)');
        $st->execute([$u['id'], strlen($codigo), strlen($resultado)]);
    } catch (Exception $e) {}

    json_out(['ok' => true, 'resultado' => $resultado]);
}

json_out(['error' => 'Ação inválida.'], 400);
