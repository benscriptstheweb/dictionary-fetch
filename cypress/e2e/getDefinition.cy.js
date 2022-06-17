/// <reference types="cypress" />

describe('define-me tests', () => {
  beforeEach(() => {
    cy.visit('http://localhost:8080')
  })

  it('opens definition card with definition of searched word', () => {
    cy.get('.search-box').type('test')
    cy.get('form').submit()
    cy.get('.definition-card').should(($definitionCard) => {
      expect($definitionCard).to.be.visible
    })
    cy.get('.definition-title').should(($definitionTitle) => {
      expect($definitionTitle.text()).to.eq('test')
    })
    cy.get('.definition-btn-close').click()
  })

  it('bookmarks the definition then delete bookmark', () => {
    cy.get('.search-box').type('bookmark')
    cy.get('form').submit()
    cy.get('.definition-btn-bookmark').click().should('have.class', 'bookmarked')
    cy.get('.definition-btn-close').click()
    cy.get('.entry > :nth-child(1)').should('be.visible')
    cy.get('.entry > :nth-child(1)').click()
    cy.get('.definition-title').should(($definitionTitle) => {
      expect($definitionTitle.text()).to.eq('bookmark')
    })
    cy.get('.definition-btn-close').click()
    cy.get('.delete-button').click()
  })

  it('bookmark multiple then delete specified bookmark', () => {
    cy.get('.search-box').type('one')
    cy.get('form').submit()
    cy.get('.definition-btn-bookmark').click().should('have.class', 'bookmarked')
    cy.get('.definition-btn-close').click()
    cy.get('.bookmark-card > :nth-child(2)').should('be.visible')
    cy.get('.bookmark-card > :nth-child(2)').click()
    cy.get('.definition-title').should(($definitionTitle) => {
      expect($definitionTitle.text()).to.eq('one')
    })
    cy.get('.definition-btn-close').click()

    cy.get('.search-box').type('two')
    cy.get('form').submit()
    cy.get('.definition-btn-bookmark').click().should('have.class', 'bookmarked')
    cy.get('.definition-btn-close').click()
    cy.get('.bookmark-card > :nth-child(3)').should('be.visible')
    cy.get('.bookmark-card > :nth-child(3)').click()
    cy.get('.definition-title').should(($definitionTitle) => {
      expect($definitionTitle.text()).to.eq('two')
    })
    cy.get('.definition-btn-close').click()
    cy.get('.bookmark-card > :nth-child(3) > .delete-button').click()
    cy.get('.bookmark-card').should('not.contain', 'two')
  })
})
