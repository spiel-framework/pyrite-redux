export const examples = {
    exampleHTML: `
        <div>
            <p><b>It show the time with this {this.delay} when the button is clicked</b></p>
            <button 
                onclick={(event: any)=> this.store.dispatch(this.getTime(this.delay) as any)}> Click
            </button><br/>
            {(this.time || this.frozen) ? 
                <div> 
                    <span>Time: {this.time ? this.time.toString(): ''}</span><br/>
                    <span>Frozen: {this.frozen.toString()}</span>
                </div> :
                <span>It isn't running yet</span>
            }
        </div>
        `,
    exampleCtrl : `
        import {Component, Template, m} from 'pyrite';
        import {Redux, Store} from '../../src/index';
        import {ExampleTemplate} from './ExampleTemplate';
        import {reducers, middlewares, getTime} from './helpers'

        @Template(ExampleTemplate)
        @Redux(reducers, middlewares)
        export class ExampleController extends Component<any> {
            delay: number = 500;
            time: string;
            frozen: boolean= false;
            store: Store<{}>
            getTime = getTime;

            $onCreate() {
                this.store.subscribe(()=>{
                    const state: any = this.store.getState();
                    if(state.time) this.time = state.time.time;
                    this.frozen = state.time.frozen;
                    m.redraw();
                })
            }
        }`,
    exampleReducers : `
        const timeState = {};
        
        export const reducers = {
            time: function (state = timeState, action: any) {
                switch (action.type) {
                    case 'GET_TIME_REQUEST':
                    return {
                        ...state,
                        frozen: true
                    }
                    case 'GET_TIME_SUCCESS':
                    return {
                        ...state,
                        time: action.result.time,
                        frozen: false
                    }
                    case 'GET_TIME_FAILURE':
                    // we could add an error message here, to be printed somewhere in our application
                    return {
                        ...state,
                        frozen: false
                    }
                    default:
                    return state
                }
            }
        }
    `,
    exampleActions : `
    export function getTime(delay: number) {
        return {
            types: ['GET_TIME_REQUEST', 'GET_TIME_SUCCESS', 'GET_TIME_FAILURE'],
            promise: () => {
                return new Promise((resolve, reject) => {
                  // Just simulating an async request to a server via a setTimeout
                  setTimeout(() => {
                    const d = new Date();
                    const ms = ('000' + d.getMilliseconds()).slice(-3)
                    resolve({
                      time: \`\${d.toString().match(/\d{2}:\d{2}:\d{2}/)[0]}.\${ms}\`
                    })
                  }, delay)
                })
            }
        }
      } 
    `,
    exampleMiddlewares: `
        function timeMiddleware() {
            return (next: any) => (action: any) => {
                const { promise, types, ...rest } = action
                if (!promise) {
                return next(action)
                }
            
                const [REQUEST, SUCCESS, FAILURE] = types
            
                next({...rest, type: REQUEST})
            
                return promise().then(
                (result: any) => {
                    next({...rest, result, type: SUCCESS})
                },
                (error: any) => {
                    next({...rest, error, type: FAILURE})
                }
                )
            }
        }
        
        export const middlewares = [timeMiddleware];
    `
}