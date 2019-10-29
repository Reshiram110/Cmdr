declare namespace Cmdr {
  export interface Registry {
    RegisterTypesIn (container: Instance): void
    RegisterType (name: string, typeDefinition: TypeDefinition): void
    GetType (name: string): TypeDefinition | undefined
    RegisterHooksIn (container: Instance): void
    RegisterCommandsIn (container: Instance, filter?: (command: CommandDefinition) => boolean): void
    RegisterCommand (commandScript: ModuleScript, commandServerScript?: ModuleScript, filter?: (command: CommandDefinition) => boolean): void
    RegisterDefaultCommands (groupsOrFilterFunc?: string[] | ((command: CommandDefinition) => boolean)): void
    GetCommand (name: string): CommandDefinition | undefined
    GetCommands (): CommandDefinition[]
    GetCommandsAsStrings (): string[]
    RegisterHook (hookName: string, callback: (context: CommandContext) => string | void, priority?: number): void
    GetStore<T extends (any[] | Map<any, any>)>(name: string): T
  }
  export interface EvaluateAndRunOptions {
    Data?: any
    IsHuman?: boolean
  }
  export interface Dispatcher {
    Run (...segments: string[]): string
    EvaluateAndRun (text: string, executor?: Player, data?: EvaluateAndRunOptions): string
    GetHistory (): string[]
  }
  interface BaseMakeSequenceTypeOptions<T, R> {
    TransformEach?: (value: string) => T
    ValidateEach?: (value: T, index: number) => [boolean, string?]
  }
  interface ConstructorMakeSequenceTypeOptions<T, R> extends BaseMakeSequenceTypeOptions<T, R> {
    Constructor: (...values: T[]) => R
  }
  interface ParseMakeSequenceTypeOptions<T, R> extends BaseMakeSequenceTypeOptions<T, R> {
    Parse: (values: T[]) => R
  }
  export type MakeSequenceTypeOptions<T, R> = ConstructorMakeSequenceTypeOptions<T, R> | ParseMakeSequenceTypeOptions<T, R>
  export interface Util {
    MakeDictionary: <T>(array: T[]) => Map<T, true>
    MakeFuzzyFinder: <T extends string | Instance | { Name: string } | keyof typeof Enum>(setOrContainer: T[] | Instance) => (text: string, returnFirst?: boolean) => T
    GetNames:  (instances: Instance[] | { Name: string }[]) => string[]
    SplitString: (text: string, max?: number) => string[]
    GetTextSize: (text: string, label: TextLabel | TextBox | TextButton, size?: Vector2) => Vector2
    MakeEnumType: (name: string, values: string[]) => TypeDefinition
    MakeListableType: (type: TypeDefinition) => TypeDefinition
    SubstituteArgs: (text: string, replace: string[] | { [index: string]: string } | ((variable: string) => string)) => string
    RunEmbeddedCommands: (dispatcher: Dispatcher, commandString: string) => string
    MakeSequenceType: <T, R>(options: MakeSequenceTypeOptions<T, R>) => TypeDefinition
    SplitPrioritizedDelimeter: (text: string, delimeters: string[]) => string[]
    EmulateTabstops: (text: string, tabWidth: number): string
    ParseEscapeSequences: (text: string) => string
  }
  export interface ArgumentDefinition {
    Type: string
    Name: string
    Description: string
    Optional?: boolean
    Default?: any
  }
  export interface CommandDefinition {
    Name: string
    Aliases: string[]
    AutoExec: string[]
    Description: string
    Args: ArgumentDefinition[]
    Group?: any
    Data? (context: CommandContext): any
    Run? <T extends any[]> (context: CommandContext, ...args: T): string
  }
  export interface TypeDefinition<T extends any[] = [string]> {
    Parse (...value: T): any
    Transform? (raw: string, player: Player): T
    Validate? (...value: T): [boolean, string?]
    ValidateOnce? (...value: T): [boolean, string?]
    Autocomplete? (...value: T): string[]
    DisplayName?: string
    Listable?: boolean
  }
  export interface CommandContext<StateType = object> {
    Cmdr: Cmdr | CmdrClient
    Dispatcher: Cmdr.Dispatcher
    Name: string
    RawText: string
    Group: any
    State: StateType
    Aliases: string[]
    Description: string
    Executor: Player
    RawArguments: string[]
    Arguments: ArgumentContext[]
    Response: string | undefined
    GetArgument (index: number): ArgumentContext
    GetData (): unknown
    GetStore<T extends (any[] | Map<any, any>)>(name: string): T
    SendEvent (player: Player, event: string, ...args: any[]): void
    BroadcastEvent (event: string, ...args: any[]): void
    Reply (text: string, color?: Color3): void
  }
  export interface ArgumentContext {
    Command: CommandContext
    Name: string
    Type: TypeDefinition
    Required: boolean
    Executor: Player
    RawValue: string
    RawSegments: string[]
    Prefix: string
    GetValue (): any
    GetTransformedValue (segment: number): any
  }
}

declare class Cmdr {
  static Registry: Cmdr.Registry
  static Dispatcher: Cmdr.Dispatcher
  static Util: Cmdr.Util
}

declare class CmdrClient extends Cmdr {
  static SetActivationKeys (keys: Enum.KeyCode[]): void
  static SetMashToEnable (isEnabled: boolean): void
  static SetPlaceName (labelText: string): void
  static SetInputLabel (labelText: string): void
  static SetEnabled (isEnabled: boolean): void
  static HandleEvent (event: string, handler: (...args: any[]) => void): void
  static Enabled: boolean
  static InputLabel: string
  static ActivationKeys: Map<Enum.KeyCode, true>
}


declare module "game.ReplicatedStorage.Cmdr" {
  export = CmdrClient
}

export = Cmdr