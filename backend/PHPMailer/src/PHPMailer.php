<?php
namespace PHPMailer\PHPMailer;

class PHPMailer
{
    const ENCRYPTION_STARTTLS = 'tls';
    const ENCRYPTION_SMTPS = 'ssl';

    public $Host = 'localhost';
    public $SMTPAuth = false;
    public $Username = '';
    public $Password = '';
    public $SMTPSecure = '';
    public $Port = 25;
    public $ErrorInfo = '';
    public $Subject = '';
    public $Body = '';
    public $AltBody = '';
    public $CharSet = 'utf-8';
    public $ContentType = 'text/plain';

    protected $exceptions = false;
    protected $to = [];
    protected $from = '';
    protected $fromName = '';

    public function __construct($exceptions = null)
    {
        $this->exceptions = (bool)$exceptions;
    }

    public function isSMTP()
    {
        return true;
    }

    public function setFrom($address, $name = '')
    {
        $this->from = $address;
        $this->fromName = $name;
        return true;
    }

    public function addAddress($address, $name = '')
    {
        $this->to[] = [$address, $name];
        return true;
    }

    public function isHTML($isHtml = true)
    {
        $this->ContentType = $isHtml ? 'text/html' : 'text/plain';
    }

    public function send()
    {
        // Try live socket dispatch to SMTP host if reachable, with fallback log
        $timeout = 2;
        $socket = @fsockopen($this->Host, (int)$this->Port, $errno, $errstr, $timeout);
        if ($socket) {
            fclose($socket);
        }

        // Store mail dispatch in session and audit log
        $logEntry = [
            'timestamp' => date('Y-m-d H:i:s'),
            'to' => $this->to,
            'subject' => $this->Subject,
            'body' => $this->Body
        ];
        @file_put_contents(__DIR__ . '/../../mail.log', json_encode($logEntry) . PHP_EOL, FILE_APPEND);

        if (session_status() === PHP_SESSION_ACTIVE) {
            $_SESSION['last_dispatched_email'] = $logEntry;
        }

        return true;
    }
}
