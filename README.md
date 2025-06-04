# Calculadora e Analisador IPv4 🌐

Uma ferramenta front-end interativa construída com React, TypeScript e Tailwind CSS para calcular e analisar informações detalhadas de redes IPv4, visualizar sub-redes e planejar novas sub-redes de tamanho fixo.

## 📜 Descrição

Este projeto visa fornecer uma interface amigável e educativa para usuários que precisam entender ou trabalhar com o endereçamento IPv4. Ao inserir um endereço IP e selecionar uma máscara de sub-rede/CIDR, a calculadora exibe informações cruciais como endereço de rede, endereço de broadcast, faixa de IPs utilizáveis, e mais. Adicionalmente, apresenta uma visualização gráfica da sub-rede analisada e uma ferramenta para planejar a divisão de um bloco de rede em múltiplas sub-redes de tamanho fixo.

A ferramenta foi desenvolvida sem a necessidade de um back-end, realizando todos os cálculos diretamente no navegador.

## ✨ Funcionalidades

* Entrada de endereço IPv4.
* Seleção de Máscara de Sub-rede/CIDR através de um menu dropdown (de /0 a /32) para a calculadora principal.
* Cálculo e exibição instantânea de:
    * Endereço de Rede
    * Endereço de Broadcast
    * Primeiro Host Utilizável
    * Último Host Utilizável
    * Número Total de Hosts na sub-rede
    * Número de Hosts Utilizáveis
    * Máscara Wildcard
    * Identificação de IP Privado
* **Visualização gráfica da sub-rede analisada**, mostrando a distribuição dos endereços de rede, utilizáveis e de broadcast.
* **Ferramenta para planejamento de sub-redes de tamanho fixo**, permitindo ao usuário especificar um bloco de rede base e o número de sub-redes desejadas.
* Interface responsiva e estilizada com Tailwind CSS.
* Validação de entrada para o formato do endereço IP e para os parâmetros do planejador de sub-redes.

## 🛠️ Tecnologias Utilizadas

* **React:** Biblioteca JavaScript para construção de interfaces de usuário.
* **TypeScript:** Superset do JavaScript que adiciona tipagem estática.
* **Tailwind CSS:** Framework CSS utility-first para estilização rápida.
* **Vite:** Ferramenta de build front-end moderna e rápida.

## ⚙️ Como Usar

A aplicação é dividida em duas ferramentas principais: a Calculadora/Analisador de IPv4 e o Planejador de Sub-redes.

### Calculadora Principal e Analisador IPv4

1.  **Insira o Endereço IP:** No campo "Endereço IP:", digite o endereço IPv4 que você deseja analisar (ex: `192.168.1.10`).
2.  **Selecione a Máscara de Sub-rede (CIDR):** No campo "Máscara de Sub-rede (CIDR):", utilize o menu dropdown para selecionar a máscara de sub-rede desejada. As opções são exibidas no formato `MÁSCARA (PREFIXO_CIDR)`, por exemplo, `255.255.255.0 (/24)`.
3.  **Calcular:** Clique no botão "Calcular".
4.  **Visualizar Resultados:** Os resultados da análise textual serão exibidos abaixo do formulário.

### Visualização Gráfica da Sub-rede

* Após um cálculo bem-sucedido na Calculadora Principal, uma visualização gráfica da sub-rede analisada aparecerá abaixo dos resultados textuais.
* Ela mostra blocos representando o Endereço de Rede, a Faixa de IPs Utilizáveis e o Endereço de Broadcast, ajudando a entender a estrutura da sub-rede. O IP inserido também é destacado se estiver dentro da faixa utilizável.

### Planejador de Sub-redes (Tamanho Fixo)

Esta ferramenta permite dividir um bloco de rede maior em várias sub-redes menores de tamanho igual.

1.  **Acesse o Planejador:** Role a página para baixo, abaixo da calculadora principal e da visualização gráfica.
2.  **IP Base da Rede:** Digite o endereço de rede do bloco IP que você deseja dividir (ex: `192.168.0.0`). É importante que este seja o endereço de rede real do bloco base.
3.  **CIDR Base:** Selecione o prefixo CIDR do bloco IP base no menu dropdown (ex: `/24`).
4.  **Nº de Sub-redes Desejadas:** Digite o número de sub-redes menores que você deseja criar a partir do bloco base.
5.  **Planejar:** Clique no botão "Planejar Sub-redes".
6.  **Ver Resultados do Planejamento:** Se as entradas forem válidas e o planejamento for possível, uma tabela será exibida com os detalhes de cada sub-rede gerada.

## 📊 Entendendo os Resultados (da Calculadora Principal)

A calculadora exibe várias informações sobre a rede IPv4. Aqui está o significado de cada uma delas:

* **Endereço IP Inserido:**
    * O endereço IPv4 que você forneceu para análise.

* **Máscara de Sub-rede (/CIDR):**
    * Exibe a máscara de sub-rede completa em notação decimal pontilhada e seu prefixo CIDR equivalente (ex: `255.255.255.0 (/24)`).
    * A máscara de sub-rede divide o endereço IP em duas partes: a porção de **rede** e a porção de **host**. O prefixo CIDR (Classless Inter-Domain Routing) indica o número de bits iniciais que compõem a porção de rede.

* **Endereço de Rede:**
    * **O que é:** O primeiro endereço IP de uma sub-rede. Ele identifica a própria sub-rede.
    * **Como é calculado:** Aplicando uma operação lógica "E" (AND bit a bit) entre o Endereço IP Inserido e a Máscara de Sub-rede.
    * **Características:** Todos os bits da porção de host neste endereço são '0'.
    * **Uso:** Não pode ser atribuído a um dispositivo individual (host) na rede.

* **Endereço de Broadcast:**
    * **O que é:** O último endereço IP de uma sub-rede. É usado para enviar dados para todos os dispositivos (hosts) dentro dessa sub-rede simultaneamente.
    * **Como é calculado:** Definindo todos os bits da porção de host como '1' no Endereço de Rede.
    * **Características:** Todos os bits da porção de host neste endereço são '1'.
    * **Uso:** Não pode ser atribuído a um dispositivo individual (host) na rede.

* **Primeiro Host Utilizável:**
    * **O que é:** O primeiro endereço IP na sub-rede que pode ser atribuído a um dispositivo (computador, servidor, etc.).
    * **Como é calculado:** Geralmente, é o Endereço de Rede + 1.
    * **Exceções:**
        * Para redes `/31` (ponto-a-ponto), este é o primeiro dos dois IPs da rede.
        * Para redes `/32` (um único host), este é o próprio endereço IP.

* **Último Host Utilizável:**
    * **O que é:** O último endereço IP na sub-rede que pode ser atribuído a um dispositivo.
    * **Como é calculado:** Geralmente, é o Endereço de Broadcast - 1.
    * **Exceções:**
        * Para redes `/31`, este é o segundo dos dois IPs da rede.
        * Para redes `/32`, este é o próprio endereço IP.

* **Número de Hosts (Total de Endereços na Sub-rede):**
    * **O que é:** O número total de endereços IP possíveis dentro da sub-rede, incluindo o endereço de rede e o de broadcast.
    * **Como é calculado:** $2^{(32 - \text{Prefixo CIDR})}$. Por exemplo, para um `/24`, são $2^{(32-24)} = 2^8 = 256$ endereços.

* **Número de Hosts Utilizáveis:**
    * **O que é:** O número de endereços IP que podem ser efetivamente atribuídos a dispositivos na sub-rede.
    * **Como é calculado (geralmente):** Número Total de Hosts - 2 (subtraindo o endereço de rede e o de broadcast).
    * **Exceções:**
        * Redes `/32`: Possuem 1 host utilizável (o próprio IP).
        * Redes `/31` (RFC 3021): São usadas para links ponto-a-ponto e possuem 2 hosts utilizáveis (ambos os IPs da sub-rede).
        * Redes `/0`: Embora teoricamente tenham $2^{32}-2$ hosts utilizáveis, seu uso prático é para rotas padrão.

* **Máscara Wildcard:**
    * **O que é:** É o inverso da máscara de sub-rede. Onde a máscara de sub-rede tem um bit '1', a wildcard tem '0', e vice-versa.
    * **Uso:** Comumente utilizada em Listas de Controle de Acesso (ACLs) em roteadores e firewalls para especificar quais endereços IP correspondem a uma regra.
    * **Como é calculada:** Aplicando uma operação lógica "NOT" (NÃO bit a bit) na Máscara de Sub-rede.

* **IP Privado:**
    * **O que é:** Indica se o "Endereço IP Inserido" pertence a uma das faixas de endereçamento reservadas pela IANA (Internet Assigned Numbers Authority) para uso em redes privadas (LANs).
    * **Faixas Privadas:**
        * `10.0.0.0` a `10.255.255.255` (`10.0.0.0/8`)
        * `172.16.0.0` a `172.31.255.255` (`172.16.0.0/12`)
        * `192.168.0.0` a `192.168.255.255` (`192.168.0.0/16`)
    * **Características:** Esses IPs não são roteáveis na internet pública e podem ser reutilizados por múltiplas redes privadas sem conflito. A comunicação com a internet é feita através de NAT (Network Address Translation).

## 📋 Entendendo o Planejador de Sub-redes

O Planejador de Sub-redes ajuda a dividir um bloco de IP maior em várias sub-redes menores de tamanhos iguais.

### Propósito

* **Organização:** Separar diferentes segmentos de rede.
* **Segurança:** Isolar redes para melhor controle de acesso.
* **Eficiência:** Reduzir o tráfego de broadcast.
* **Gerenciamento:** Facilitar a administração de porções menores da rede.

### Como Funciona (A Lógica)

1.  **Validação:** As entradas (IP base, CIDR base, número de sub-redes) são validadas. O IP base deve ser um endereço de rede válido para o CIDR base fornecido.
2.  **Cálculo de Bits Emprestados:** Para criar as sub-redes, bits são "emprestados" da porção de host do bloco original. O número de bits a emprestar é `Math.ceil(Math.log2(NumeroDeSubredesDesejadas))`.
3.  **Novo CIDR das Sub-redes:** O CIDR de cada nova sub-rede é `CIDR Base + Bits Emprestados`. Um CIDR maior significa uma rede menor.
4.  **Número Real de Sub-redes:** O número de sub-redes efetivamente criadas será $2^{\text{Bits Emprestados}}$ (pode ser maior que o solicitado se o número desejado não for uma potência de 2).
5.  **Tamanho de Cada Sub-rede:** Cada nova sub-rede terá um tamanho total de $2^{(32 - \text{Novo CIDR})}$ endereços. Este valor também serve como incremento para encontrar o próximo endereço de rede.
6.  **Geração das Sub-redes:** O planejador itera, calculando o endereço de rede de cada nova sub-rede (`EndereçoDeRedeBase + (i * TamanhoDaSubrede)`). Para cada uma, a função `analyzeIp` é usada para obter todos os seus detalhes.

### Interpretando a Tabela de Sub-redes Planejadas

A tabela de resultados do planejador mostrará, para cada sub-rede gerada:

* **Rede/CIDR:** O endereço de rede e o prefixo CIDR da sub-rede (ex: `192.168.0.0/26`).
* **Máscara:** A máscara de sub-rede em formato decimal (ex: `255.255.255.192`).
* **Faixa Utilizável:** O primeiro e o último IP que podem ser usados por dispositivos.
* **Broadcast:** O endereço de broadcast da sub-rede.
* **Hosts Utilizáveis:** Quantos dispositivos podem ser conectados.

## 🧠 Lógica Principal dos Cálculos

Os cálculos de rede são realizados no arquivo `src/utils/ipCalculator.ts`. A lógica principal envolve:

1.  **Conversão de IP para Número:** Endereços IP e máscaras em formato string (ex: "192.168.1.10") são convertidos para suas representações numéricas de 32 bits para facilitar operações bitwise.
2.  **Operações Bitwise:** Operações lógicas como AND, OR, e NOT bit a bit são usadas para determinar o endereço de rede, broadcast e wildcard a partir do IP e da máscara numérica.
3.  **Manipulação de CIDR:** O prefixo CIDR é usado para determinar o número de bits de rede e de host, o que é fundamental para calcular o número total de hosts e a faixa de hosts utilizáveis.
4.  **Validações:** Funções de validação garantem que os formatos de IP e máscara (quando aplicável) sejam corretos antes de prosseguir com os cálculos. O planejamento de sub-redes também inclui validações específicas para a viabilidade da divisão.

## 🤝 Contribuições

Contribuições são bem-vindas! Se você tiver sugestões para melhorar esta calculadora, sinta-se à vontade para abrir uma issue ou enviar um pull request

## 👤 Autor

* **Brian Lucca**