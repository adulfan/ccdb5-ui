import configureMockStore from 'redux-mock-store'
import thunk from 'redux-thunk'
import { queryManager } from '../queryManager'
import { REQUERY_ALWAYS, REQUERY_HITS_ONLY } from '../../constants'

function setupStore( viewMode = 'Map' ) {
  const middlewares = [ thunk, queryManager ]
  const mockStore = configureMockStore( middlewares )
  return mockStore( {
    map: {
      activeCall: ''
    },
    query: {
      date_received_min: new Date( 2013, 1, 3 ),
      from: 0,
      has_narrative: true,
      queryString: '?foo',
      searchText: '',
      size: 10,
      tab: viewMode
    },
    results: {
      activeCall: ''
    }
  } )
}

describe( 'redux middleware::queryManager', () => {
  describe( 'compound actions', () => {
    let store

    describe( 'Unknown Mode', () => {
      beforeEach( () => {
        store = setupStore( 'bogus' )
      } )

      it( 'REQUERY_ALWAYS runs no queries', () => {
        const action = {
          type: 'FakeAction',
          requery: REQUERY_ALWAYS
        }
        const expectedActions = [
          { type: 'FakeAction', requery: REQUERY_ALWAYS }
        ]

        store.dispatch( action )
        expect( store.getActions() ).toEqual( expectedActions )
      } )

      it( 'REQUERY_HITS_ONLY runs no queries', () => {
        const action = {
          type: 'FakeAction',
          requery: REQUERY_HITS_ONLY
        }
        const expectedActions = [
          { type: 'FakeAction', requery: REQUERY_HITS_ONLY }
        ]

        store.dispatch( action )
        expect( store.getActions() ).toEqual( expectedActions )
      } )
    } )

    describe( 'List Mode', () => {
      beforeEach( () => {
        store = setupStore( 'List' )
      } )
      it( 'does not query if an action has no metadata', () => {
        const action = {
          type: 'FakeAction'
        }
        const expectedActions = [ { type: 'FakeAction' } ]

        store.dispatch( action )
        expect( store.getActions() ).toEqual( expectedActions )
      } )

      describe( 'REQUERY_ALWAYS', () => {
        it( 'runs both left and right queries', () => {
          const action = {
            type: 'FakeAction',
            requery: REQUERY_ALWAYS
          }
          const expectedActions = [
            { type: 'FakeAction', requery: REQUERY_ALWAYS },
            // put this back when we have the api
            // { type: 'AGGREGATIONS_API_CALLED', url: "@@API?foo" },
            { type: 'COMPLAINTS_API_CALLED', url: "@@API?foo" },
            { type: 'COMPLAINTS_API_CALLED', url: "@@API?foo" }
          ]

          store.dispatch( action )
          expect( store.getActions() ).toEqual( expectedActions )
        } )
      } )

      describe( 'REQUERY_HITS_ONLY', () => {
        it( 'only runs right hand queries', () => {
          const action = {
            type: 'FakeAction',
            requery: REQUERY_HITS_ONLY
          }
          const expectedActions = [
            { type: 'FakeAction', requery: REQUERY_HITS_ONLY },
            { type: 'COMPLAINTS_API_CALLED', url: "@@API?foo" }
          ]

          store.dispatch( action )
          expect( store.getActions() ).toEqual( expectedActions )
        } )
      } )
    } )

    describe( 'Map Mode', () => {
      beforeEach( () => {
        store = setupStore( 'Map' )
      } )
      describe( 'REQUERY_ALWAYS', () => {
        it( 'runs both left and right queries', () => {
          const action = {
            type: 'FakeAction',
            requery: REQUERY_ALWAYS
          }
          const expectedActions = [
            { type: 'FakeAction', requery: REQUERY_ALWAYS },
            // put this back when we have the api
            // { type: 'AGGREGATIONS_API_CALLED', url: "@@API?foo" },
            { type: 'COMPLAINTS_API_CALLED', url: "@@API?foo" },
            { type: 'STATES_API_CALLED', url: "@@APIstates/?foo" }
          ]

          store.dispatch( action )
          expect( store.getActions() ).toEqual( expectedActions )
        } )
      } )

      describe( 'REQUERY_HITS_ONLY', () => {
        it( 'only runs right hand queries', () => {
          const action = {
            type: 'FakeAction',
            requery: REQUERY_HITS_ONLY
          }
          const expectedActions = [
            { type: 'FakeAction', requery: REQUERY_HITS_ONLY },
            { type: 'STATES_API_CALLED', url: "@@APIstates/?foo" }
          ]

          store.dispatch( action )
          expect( store.getActions() ).toEqual( expectedActions )
        } )
      } )
    } )
  } )
} )
