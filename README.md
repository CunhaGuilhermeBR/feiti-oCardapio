# Speck Web App Backend

## Configurações

Todas as a configurações da aplicação são realizadas através de variáveis de ambiente.

### Arquivo **`.env`** (módulo **dotenv**)

Em tempo de desenvolvimento, as configurações do ambiente de cada desenvolvedor deve residir no arquivo `[ROOT]/.env`.

> **Obs.:** Como boa prática o arquivo `.env` não deve ser comitado junto com o projeto. O `.gitignore` está parametrizado para excluir este arquivo.

**Exemplo do arquivo `.env`**

```shell
# Application Settings
APPLICATION_URL=
NODE_ENV=
DEBUG=
PORT=
HOST=
BASE_PATH=
FILE_STORAGE_DIRECTORY=

# Database Settings
DB_HOST=
DB_PORT=
DB_DATABASE=
DB_USER=
DB_PASSWORD=
DB_URL=
DB_SSL=
DB_MIN=
DB_MAX=
DB_SSL_CA=[BASE64 CONTENT]
DB_SSL_CERT=[BASE64 CONTENT]
DB_SSL_KEY=[BASE64 CONTENT]
DB_SSL_REJECTUNAUTHORIZED=

# Email settings
MAIL_HOST=
MAIL_PORT=
MAIL_AUTH_USER=
MAIL_AUTH_PASSWORD=
MAIL_SECURE=
MAIL_TLS_REJECT_UNAUTHORIZED=
MAIL_LOGGER=
MAIL_DEBUG=

SPECK_URL=
SPECK_ORIGIN=
SPECK_TOKEN=
SPECK_USER=
SPECK_PASSWORD=
SPECK_SCHEDULE=
SPECK_STORE_PRODUCTS=

MOODLE_URL=
MOODLE_TOKEN=

API_EXPLORER_SERVERS=
```

### Configurações da Aplicação

As variáveis abaixo configuram o funcionamento do servidor da aplicação:

- `APPLICATION_URL`: Domínio da aplicação gerenciada pelo instância corrente do backend. Deve ser o mesmo valor cadastrado no banco de dados para a aplicação corrente. O valor não deve ser prefixado por protocolo HTTP ou conter trailing slash no final, por exemplo, não é permitido: http://spekwebapp.com.br, https://spekwebapp.com.br/.

> <span style="color: yellow; font-size: 16px; font-weight: 700">ATENÇÃO</span>
>
> A configuração desta variável é <span style="color: red">obrigatória</span> para a correta integração com o Moodle.
>
> Sem ela não é possível ao webhook de acesso do Moodle identificar a aplicação sendo referenciada no momento da chamada.

- `HOST`: Endereço IP ou DNS local em que o servidor espera por conexões. (_`Default:`_ localhost)
- `PORT`: Porta do servidor da aplicação. (_`Default:`_ 3000)
- `BASE_PATH`: Context Path da aplicação no formato. Ex.: <span style="color: green">**/api**</span> - (_`Default:`_ <span style="color: red">**/**</span>)
- `DEBUG`: Habilita o debug da aplicação. A configuração segue as convenções do módulo. [`debug`](https://www.npmjs.com/package/debug) e por padrão todos os debugs da aplicação são prefixados com `speck:` (_`Default:`_ undefined).

> `Exemplos de valores possíveis`:
>
> - `speck:*`: exibe debugs de todas as features
> - `speck:jwt-strategy`: exibe debugs da geração do token JWT
> - `speck:imagedownloadcontroller`: exibe debugs do controller de download de imagens
> - `speck:imagecontroller`: ...
> - `speck:logincontroller`: ...

- `FILE_STORAGE_DIRECTORY`: Local/diretório para armazenar arquivos temporários (_`Default:`_ ./../.sandbox)

### Configurações de Banco de Dados

As configurações de banco de dados são especificadas através das variáveis:

- `DB_HOST`: Endereço de rede do banco de dados (hostname/IP).
- `DB_PORT`: Porta de acesso ao banco.
- `DB_USER`: Usuário de acesso ao banco.
- `DB_PASSWORD`: Senha do usuário de banco de dados.
- `DB_DATABASE`: Banco de dados configurado para a aplicação.
- `DB_URL`: URL de conexão banco de dados. (Ex.: **postgres://speck:speck01@localhost/speck**)
- `DB_SSL`: Indica se o banco utiliza SSL na conexão. Em **produção** deve ser configurado como <span style="color:green">**true**</span>
- `DB_SSL_CA`: Conteúdo em formato base64 do Certificate Authority
- `DB_SSL_CERT`: Conteúdo em formato base64 do certificado SSL
- `DB_SSL_KEY`: Conteúdo em formato base64 da key do certificado SSL
- `DB_SSL_REJECTUNAUTHORIZED`: Indica se irá rejeitar conexões SSL não authorizadas

> **Obs.:** Se a variável `DB_URL` for informada, as demais variáveis (com excessão da _DB_SSL_) não são necessárias, pois todos os atributos de conexão ao banco já estão contidas nesta URL.

### Configurações do Servidor de E-Mail

- `MAIL_HOST`: Endereço (host) do servidor de SMTP (_`Default:`_ localhost)
- `MAIL_PORT`: Porta do servidor de SMTP (_`Default:`_ 587)
- `MAIL_AUTH_USER`: Usuário/conta de autentiação com permissão para envio de e-mail
- `MAIL_AUTH_PASSWORD`: Senha de acesso da conta
- `MAIL_SECURE`: Se true a conexão usará TLS quando conectar ao servidor (_`Default:`_ False)
- `MAIL_TLS_REJECT_UNAUTHORIZED`: Indica se rejeita conexões não autorizadas (_`Default:`_ False)
- `MAIL_LOGGER`: Habilita o log de e-mail para validação (_`Default:`_ False)
- `MAIL_DEBUG`: Habilita o debug de envio do e-mail (_`Default:`_ False)

### Configurações da integração com o serviço do Speck

- `SPECK_URL`: Endereço da api do Speck
- `SPECK_ORIGIN`: Origin http que deve ser enviado ao chamar a API do Speck
- `SPECK_TOKEN`: Token de acesso a API do Speck
- `SPECK_USER`: Usuário de acesso a API do Speck
- `SPECK_PASSWORD`: Senha de acesso a API do Speck
- `SPECK_SCHEDULE`: Configuração do Job de integração com o Speck no formato CRON (_`Default:`_ <span style="color: red">_/5 _ \* \* \* \*</span>)
- `SPECK_STORE_PRODUCTS`: Configuração mapeamento dos produtos cadastrados no WIX vs Template do Speck. O valor deve ser especificado em JSON válido, conforme exemplo:

### Configurações do API Explorer

- `API_EXPLORER_SERVERS`: Configura os servidores de testes do API Explorer (_`Default:`_ indefinido). O valor da variável é uma lista de objetos JSON em formato string (em uma única linha) que devem obedecer ao formato:

```json
[
  {
    "url": "URL DA API",
    "description": "DESCRIÇÃO DA URL. (Opcional)"
  },
  ...
]
```

`Exemplo`:

```env
API_EXPLORER_SERVERS='[{"url": "/"}, {"url": "https://homol.fiergs.org.br/api"}, {"url": "https:/teste.fiergs.org.br/api", "description": "teste"}]'
```

**JSON**:

```json
{
  "TESTE": "319305e6-ddcf-4613-84f1-b41191e91571",
  "TESTE 2": "319305e6-ddcf-4613-84f1-b41191e91571"
}
```

**Variável de Ambiente**:

```bash
SPECK_STORE_PRODUCTS='{"TESTE": "319305e6-ddcf-4613-84f1-b41191e91571", "TESTE 2": "319305e6-ddcf-4613-84f1-b41191e91571"}'
```

### Configurações da integração com o Moodle

- `MOODLE_URL`: URL do Moodle
- `MOODLE_TOKEN`: Toke de acesso ao Moodle

## Configurações do Ambiente do BlueMix

As configurações do ambiente do Bluemix são realizadas através das variávies de ambiente especificadas no item **Configurações**.

Algumas considerações a respeito das variáveis de ambiente no Bluemix:

- `PORT`: O Bluemix não permite configurar esta variável, pois o mesmo já configura e utiliza a mesma por padrão.
- `HOST`: Deve ser configurada para <span style="color: green">"**0.0.0.0**"</span> para permitir bind dos IPs em todas as interfaces do container. Se for omitida não é possível acessar a aplicação externamente, pois o valor padrão da mesma é <span style="color: yellow">"**localhost**"</span>.

---

## **HarpaLabs** &trade;&reg;
