
Cypress.Commands.add('fillMandatoryFieldsAndSubmit', function(){
    cy.get('#firstName').type('Leonardo')
    cy.get('#lastName').type('Kyrillos')
    cy.get('#email').type('leo@gmail.com')
    cy.get('#open-text-area').type('Test')
    cy.get('button[type="submit"]').click()
})
