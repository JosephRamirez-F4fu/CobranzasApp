export interface A {
  openapi: string;
  info: Info;
  paths: Paths;
  components: Components;
}

export interface Components {
  schemas: Schemas;
}

export interface Schemas {
  HTTPValidationError: HTTPValidationError;
  PaginationData: PaginationData;
  PaginationDataPerfiles: PaginationDataPerfiles;
  PaginationDataScroringLogs: PaginationDataScroringLogs;
  PaginationDataVariables: PaginationDataVariables;
  Perfil: Perfil;
  PerfilData: PerfilData;
  PerfilPatch: PerfilPatch;
  ScoringLogConfigData: ScoringLogConfigData;
  ScoringLogData: ScoringLogData;
  ValidationError: ValidationError;
  Variable: Variable;
  VariableData: VariableData;
  VariablePatch: VariablePatch;
  VariableType: VariableType;
}

export interface HTTPValidationError {
  properties: HTTPValidationErrorProperties;
  type: string;
  title: string;
}

export interface HTTPValidationErrorProperties {
  detail: Detail;
}

export interface Detail {
  items: Pagination;
  type: string;
  title: string;
}

export interface Pagination {
  $ref: string;
}

export interface PaginationData {
  properties: PaginationDataProperties;
  type: string;
  required: string[];
  title: string;
}

export interface PaginationDataProperties {
  total_items: CurrentPage;
  total_pages: CurrentPage;
  current_page: CurrentPage;
}

export interface CurrentPage {
  type: Type;
  title: string;
}

export enum Type {
  Integer = 'integer',
  Null = 'null',
  Number = 'number',
  String = 'string',
}

export interface PaginationDataPerfiles {
  properties: PaginationDataPerfilesProperties;
  type: string;
  required: string[];
  title: string;
}

export interface PaginationDataPerfilesProperties {
  pagination: Pagination;
  perfiles: Detail;
}

export interface PaginationDataScroringLogs {
  properties: PaginationDataScroringLogsProperties;
  type: string;
  required: string[];
  title: string;
}

export interface PaginationDataScroringLogsProperties {
  pagination: Pagination;
  scoring_logs: Detail;
}

export interface PaginationDataVariables {
  properties: PaginationDataVariablesProperties;
  type: string;
  required: string[];
  title: string;
}

export interface PaginationDataVariablesProperties {
  pagination: Pagination;
  variables: Detail;
}

export interface Perfil {
  properties: PerfilProperties;
  type: string;
  required: string[];
  title: string;
}

export interface PerfilProperties {
  id: Descripcion;
  activo: Activo;
  nombre: CurrentPage;
  descripcion: Descripcion;
  min_score: CurrentPage;
  max_score: CurrentPage;
}

export interface Activo {
  type: string;
  title: string;
  default: boolean;
}

export interface Descripcion {
  anyOf: DescripcionAnyOf[];
  title: string;
}

export interface DescripcionAnyOf {
  type: Type;
}

export interface PerfilData {
  properties: PerfilDataProperties;
  type: string;
  required: string[];
  title: string;
}

export interface PerfilDataProperties {
  nombre: CurrentPage;
  descripcion: Descripcion;
  min_score: Score;
  max_score: Score;
}

export interface Score {
  type: Type;
  title: string;
  default: number;
}

export interface PerfilPatch {
  properties: PerfilPatchProperties;
  type: string;
  title: string;
}

export interface PerfilPatchProperties {
  nombre: Descripcion;
  descripcion: Descripcion;
  min_score: Descripcion;
  max_score: Descripcion;
}

export interface ScoringLogConfigData {
  properties: ScoringLogConfigDataProperties;
  type: string;
  required: string[];
  title: string;
}

export interface ScoringLogConfigDataProperties {
  numero_iteraciones: CurrentPage;
  responsable_nombre: CurrentPage;
}

export interface ScoringLogData {
  properties: ScoringLogDataProperties;
  type: string;
  required: string[];
  title: string;
}

export interface ScoringLogDataProperties {
  perfil: CurrentPage;
  cod_cuenta: CurrentPage;
  score: CurrentPage;
  fecha_calculo: CurrentPage;
}

export interface ValidationError {
  properties: ValidationErrorProperties;
  type: string;
  required: string[];
  title: string;
}

export interface ValidationErrorProperties {
  loc: LOC;
  msg: CurrentPage;
  type: CurrentPage;
}

export interface LOC {
  items: Items;
  type: string;
  title: string;
}

export interface Items {
  anyOf: DescripcionAnyOf[];
}

export interface Variable {
  properties: VariableProperties;
  type: string;
  required: string[];
  title: string;
}

export interface VariableProperties {
  id: Descripcion;
  activo: Activo;
  nombre: CurrentPage;
  descripcion: Descripcion;
  tipo: Pagination;
}

export interface VariableData {
  properties: VariableDataProperties;
  type: string;
  required: string[];
  title: string;
}

export interface VariableDataProperties {
  nombre: CurrentPage;
  descripcion: Descripcion;
  tipo: PurpleTipo;
}

export interface PurpleTipo {
  $ref: string;
  default: number;
}

export interface VariablePatch {
  properties: VariablePatchProperties;
  type: string;
  title: string;
}

export interface VariablePatchProperties {
  nombre: Descripcion;
  descripcion: Descripcion;
  tipo: FluffyTipo;
}

export interface FluffyTipo {
  anyOf: TipoAnyOf[];
}

export interface TipoAnyOf {
  $ref?: string;
  type?: Type;
}

export interface VariableType {
  type: Type;
  enum: number[];
  title: string;
}

export interface Info {
  title: string;
  version: string;
}

export interface Paths {
  '/perfiles/': Les;
  '/perfiles/{perfil_id}': ID;
  '/variables/': Les;
  '/variables/{variable_id}': ID;
  '/scoring/logs/': ScoringLogs;
  '/scoring/logs/exportar/': ScoringLogsExportar;
  '/scoring/configuracion/': ScoringConfiguracion;
  '/': Empty;
}

export interface Empty {
  get: Get;
}

export interface Get {
  summary: string;
  operationId: string;
  responses: Responses;
  tags?: string[];
}

export interface Responses {
  '200': The200;
}

export interface The200 {
  description: Description;
  content: The200_Content;
}

export interface The200_Content {
  'application/json': PurpleApplicationJSON;
}

export interface PurpleApplicationJSON {
  schema: PurpleSchema;
}

export interface PurpleSchema {}

export enum Description {
  SuccessfulResponse = 'Successful Response',
  ValidationError = 'Validation Error',
}

export interface Les {
  post: PostClass;
  get: PostClass;
}

export interface PostClass {
  tags: string[];
  summary: string;
  operationId: string;
  parameters?: PostParameter[];
  responses: { [key: string]: PostResponse };
  requestBody?: RequestBody;
}

export interface PostParameter {
  name: string;
  in: In;
  required: boolean;
  schema: FluffySchema;
}

export enum In {
  Path = 'path',
  Query = 'query',
}

export interface FluffySchema {
  type: Type;
  default?: number | string;
  title: string;
}

export interface RequestBody {
  required: boolean;
  content: RequestBodyContent;
}

export interface RequestBodyContent {
  'application/json': FluffyApplicationJSON;
}

export interface FluffyApplicationJSON {
  schema: Pagination;
}

export interface PostResponse {
  description: Description;
  content: RequestBodyContent;
}

export interface ID {
  delete: Delete;
  put: PostClass;
  patch: PostClass;
}

export interface Delete {
  tags: string[];
  summary: string;
  operationId: string;
  parameters?: DeleteParameter[];
  responses: { [key: string]: DeleteResponse };
  requestBody?: RequestBody;
}

export interface DeleteParameter {
  name: string;
  in: In;
  required: boolean;
  schema: CurrentPage;
}

export interface DeleteResponse {
  description: Description;
  content: PurpleContent;
}

export interface PurpleContent {
  'application/json': TentacledApplicationJSON;
}

export interface TentacledApplicationJSON {
  schema: TentacledSchema;
}

export interface TentacledSchema {
  $ref?: string;
}

export interface ScoringConfiguracion {
  get: Get;
  put: Delete;
}

export interface ScoringLogs {
  get: PostClass;
}

export interface ScoringLogsExportar {
  get: ScoringLogsExportarGet;
}

export interface ScoringLogsExportarGet {
  tags: string[];
  summary: string;
  operationId: string;
  parameters: PurpleParameter[];
  responses: { [key: string]: PurpleResponse };
}

export interface PurpleParameter {
  name: string;
  in: In;
  required: boolean;
  schema: StickySchema;
}

export interface StickySchema {
  type: Type;
  default: string;
  title: string;
}

export interface PurpleResponse {
  description: Description;
  content: FluffyContent;
}

export interface FluffyContent {
  'application/json': StickyApplicationJSON;
}

export interface StickyApplicationJSON {
  schema: IndigoSchema;
}

export interface IndigoSchema {
  type?: Type;
  title?: string;
  $ref?: string;
}
