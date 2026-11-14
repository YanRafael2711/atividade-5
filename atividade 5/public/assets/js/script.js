// Atividade 5 – Requisição HTTP (ViaCEP)

const formulario = document.getElementById("cep-form");
const campoCep = document.getElementById("cep");
const areaMensagem = document.getElementById("mensagem");
const areaResultado = document.getElementById("resultado");

formulario.addEventListener("submit", async (evento) => {
    evento.preventDefault();

    // Esconde os dados da consulta anterior.
    areaResultado.hidden = true;
    areaMensagem.textContent = "";

    // Lê o CEP e remove espaços das extremidades.
    const cep = campoCep.value.trim();

    // Aceita oito dígitos, com ou sem hífen após o quinto dígito.
    if (!/^\\d{5}-?\\d{3}$/.test(cep)) {
        areaMensagem.textContent = "CEP inválido. Digite 12328070 ou 12328-070.";
        return;
    }

    // Prepara o CEP para a URL do ViaCEP.
    const cepFormatado = cep.replace("-", "");

    areaMensagem.textContent = "Consultando...";
    campoCep.disabled = true;

    try {
        const resposta = await fetch(
            `https://viacep.com.br/ws/${cepFormatado}/json/`
        );

        // Trata respostas HTTP que não indicam sucesso.
        if (!resposta.ok) {
            throw new Error(
                `Erro do serviço: ${resposta.status} ${resposta.statusText}`.trim()
            );
        }

        const dados = await resposta.json();

        // O ViaCEP informa CEP inexistente pela propriedade "erro".
        if (dados.erro) {
            areaMensagem.textContent = "CEP não encontrado.";
            return;
        }

        // Preenche os campos usando textContent.
        document.getElementById("valor-cep").textContent = dados.cep || "Não informado";
        document.getElementById("valor-logradouro").textContent =
            dados.logradouro || "Não informado";
        document.getElementById("valor-bairro").textContent =
            dados.bairro || "Não informado";
        document.getElementById("valor-cidade").textContent =
            dados.localidade || "Não informado";
        document.getElementById("valor-uf").textContent = dados.uf || "Não informado";
        document.getElementById("valor-ibge").textContent = dados.ibge || "Não informado";

        areaMensagem.textContent = "Resposta do ViaCEP:";
        areaResultado.hidden = false;
    } catch (erro) {
        console.error("Falha ao consultar o ViaCEP:", erro);
        areaMensagem.textContent = "Falha de conexão. Tente novamente.";
    } finally {
        // Sempre libera o campo e devolve o foco ao usuário.
        campoCep.disabled = false;
        campoCep.focus();
    }
});
