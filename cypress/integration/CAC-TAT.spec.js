/// <reference types="Cypress" />

describe ('Central de Atendimento ao Cliente TAT', function() {
   beforeEach(function(){
    cy.visit('./src/index.html')
   })

    it('verifica o titulo da aplicação', function(){   
    cy.title().should('be.equal', 'Central de Atendimento ao Cliente TAT')
    })

    it('Preenche os campos obrigatórios e envia o formulário', function(){
        
        cy.clock() //congelo o relógio do navegador para capturar imagens/mensagens que desaparecem 
       
        cy.get('#firstName').should('be.visible').type('Leonardo')
        cy.get('#firstName').should('have.value', 'Leonardo')

        cy.get('#lastName').should('be.visible').type('Kyrillos')
        cy.get('#lastName').should('have.value', 'Kyrillos')

        cy.get('#email').should('be.visible').type('leo@gmail.com')
        cy.get('#email').should('have.value', 'leo@gmail.com')

        cy.get('#email-checkbox').click()
        
        //cy.get('#open-text-area').type('Correção de Exercícios')
        
        //Para longos textos eu posso criar uma variável, no caso longText abaixo,
        //então no meu teste eu passo como primeiro argumento a variável criada
        //como segundo arguento o objeto, sempre entre {}, no caso delay, que recebe valor 0.  
        const longText = "teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste, teste"
        cy.get('#open-text-area').type(longText, {delay: 0})

        cy.get('button[type="submit"]').click()

        cy.get('.success').should('be.visible')

        cy.tick(3000) //após capturar a imagem/mensagem uso o tick para adiantar o relógio do navegador

        cy.get('.success').should('not.be.visible')
    })

    it('exibe mensagem de erro ao submeter o formulário com um email com formatação inválida', function(){
        cy.clock()
        cy.get('#firstName').should('be.visible').type('Leonardo')
        cy.get('#firstName').should('have.value', 'Leonardo')

        cy.get('#lastName').should('be.visible').type('Kyrillos')
        cy.get('#lastName').should('have.value', 'Kyrillos')

        cy.get('#email').should('be.visible').type('leogmail.com')
        cy.get('#email').should('have.value', 'leogmail.com')

        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')
        
        cy.tick(3000)
        cy.get('.error').should('not.be.visible')
    })

    Cypress._.times(3, function(){
        it('Campo de telefone continua vazio quando preenchido com valor não numérico', function(){
            cy.get('#phone')
            .type('akshdyejrlsnnh')
            .should('have.value', '')
        })
    }) //Cypres._.times roda a função varias vezes, no caso 3

    it('exibe mensagem de erro quando o telefone se torna obrigatório mas não é preenchido antes do envio do formulário', function(){
        cy.clock()

        cy.get('#firstName').should('be.visible').type('Leonardo')
        cy.get('#lastName').should('be.visible').type('Kyrillos')
        cy.get('#email').should('be.visible').type('leo@gmail.com')
        cy.get('#support-type > :nth-child(3)').click()
        cy.get('#phone-checkbox').check()
        cy.get('button[type="submit"]').click()

        cy.get('.error').should('be.visible')

        cy.tick(3000)

        cy.get('.error').should('not.be.visible')
    })

    it('Preenche e Limpa os Campos Nome, Sobrenome, email, e telefone', function(){
        cy.get('#firstName')
        .type('Leonardo')
        .should('have.value', 'Leonardo')
        .clear()
        .should('have.value', '')
        cy.get('#lastName').type('Kyrillos')
        .should('have.value', 'Kyrillos')
        .clear().should('have.value', '')
        cy.get('#email').type('leo@gmail.com')
        .should('have.value', 'leo@gmail.com')
        .clear().should('have.value', '')
        cy.get('#phone-checkbox').click()
        cy.get('#phone').type('32282953')
        .should('have.value', '32282953')
        .clear().should('have.value', '')
        cy.get('button[type="submit"]').click()
        cy.get('.error').should('be.visible')
    })
    
    it('exibe Mensagem de Erro ao Submeter o Formulário Sem Preencher os Campos Obrigatórios', function(){
        cy.clock()

        cy.get('button[type="submit"]').click()
        
        cy.get('.error').should('be.visible')

        cy.tick(3000)

        cy.get('.error').should('not.be.visible')
    })

    
    it('envia o formuário com sucesso usando um comando customizado', function(){
        cy.clock()

        cy.fillMandatoryFieldsAndSubmit()

        cy.get('.success').should('be.visible')

        cy.tick(3000)

        cy.get('.error').should('not.be.visible')
    })

    it('utilizando o comando cy.contains', function(){
        cy.contains('button', 'Enviar').click()
        cy.get('.error').should('be.visible')
    })

    it('seleciona um produto -YouTube- por seu texto', function(){
        cy.get('#product').select('YouTube') //selecão pelo texto 'YouTube'
        cy.get('#product').select('youtube') //seleção pelo value 'youtube'
        cy.get('#product').select(4) //seleção pelo índice 4
        .should('have.value', 'youtube')
    })

    it('seleciona um produto -Mentoria- por seu valor', function(){
        cy.get('#product')
        .select('mentoria')
        .should('have.value', 'mentoria')
    })

    it('seleciona um produto -Blog- por seu índice', function(){
        cy.get('#product')
        .select(1)
        .should('have.value', 'blog')
    })

    it('marca o imput do tipo radio button atendimento feedback', function(){
        cy.get('input[type="radio"][value="feedback"]') //valores retirados na inspeção
        .check()
        .should('have.value', 'feedback')
        cy.get('input[type="radio"][value="ajuda"]')  //valores retirados na inspeção
        .check()
        .should('have.value', 'ajuda')
        cy.get('input[type="radio"][value="elogio"]') //valores retirados na inspeção
        .check()
        .should('have.value', 'elogio')
    })

    it('marca cada tipo de atendimento no radio button', function(){
        cy.get('input[type="radio"]')
        .should('have.length', 3)
        .each(function($radio){
            cy.wrap($radio).check()
            cy.wrap($radio).should('be.checked')
        })
    })

    it('marca ambos os checkboxes, depois desmarca o último', function(){
        cy.get('input[type="checkbox"]') //com esse seletor (mais genérico) seleciono os dois campos do checkbox
        .check()
        .should('be.checked')
        .last() //com esse comando seleciono apenas o último
        .uncheck()
        .should('not.be.checked')        
    })

    it('seleciona um arquivo da pasta fixtures', function(){
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json')
        .should(function($input){
            console.log($input) //abreo console para inspeção
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo simulando um drag-and-drop', function(){
        cy.get('input[type="file"]')
        .should('not.have.value')
        .selectFile('./cypress/fixtures/example.json', {action: 'drag-drop'}) //essa opção simula como se você arrastasse o arquivo com o mouse para cima do campo
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('seleciona um arquivo utilizando uma fixture para a qual foi dada um alias', function(){
        cy.fixture('example.json').as('sampleFile') //criando uma arrey com o nome 'sampleFile'.
        cy.get('input[type="file"]')
        .selectFile('@sampleFile') //Quando eu crio uma arry e vou selecionar eela tenho que colocar um @ na frente
        .should(function($input){
            expect($input[0].files[0].name).to.equal('example.json')
        })
    })

    it('verifica que a política de privacidade abre em outra aba sem a necessidade de um clique', function(){
        cy.get('#privacy a')
        .should('have.attr', 'target', '_blank')        
    })

    it('acessa a página da política de privacidade removendo o target e então clicando no link', function(){
        cy.get('#privacy a')
            .invoke('removeAttr', 'target')
            .click()
        
        cy.contains('Talking About Testing').should('be.visible')
    })

    it('exibe e esconde as mensagens de sucesso e erro usando o .invoke', function(){
        cy.get('.success')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Mensagem enviada com sucesso.')
          .invoke('hide')
          .should('not.be.visible')
        cy.get('.error')
          .should('not.be.visible')
          .invoke('show')
          .should('be.visible')
          .and('contain', 'Valide os campos obrigatórios!')
          .invoke('hide')
          .should('not.be.visible')
      })

    it('preenche a area de texto usando o comando .invoke', function(){
        
    })

})