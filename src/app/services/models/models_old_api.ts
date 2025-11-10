export interface TopLevel {
  openapi: string;
  info: Info;
  servers: Server[];
  security: Security[];
  tags: Tag[];
  paths: Paths;
  components: Components;
}

export interface Components {
  schemas: Schemas;
  securitySchemes: SecuritySchemes;
}

export interface Schemas {
  ApiResponseString: APIResponse;
  ChangePasswordRequest: ChangePasswordRequest;
  AlumnoUpdateRequest: AlumnoUpdateRequest;
  AlumnoResponsableRequest: AlumnoResponsableRequest;
  PasarelaPagoRegister: PasarelaPagoRe;
  ApiResponsePasarelaPagoResponse: APIResponseResponse;
  PasarelaPagoResponse: PasarelaPagoRe;
  NotificationScenarioRequest: NotificationScenario;
  ApiResponseNotificationScenarioResponse: APIResponseResponse;
  NotificationScenarioResponse: NotificationScenario;
  NotificacionConfigracionRegister: NotificacionConfigracionRe;
  ApiResponseNotificacionConfigracionResponse: APIResponseResponse;
  NotificacionConfigracionResponse: NotificacionConfigracionRe;
  NotificationScenarioSummary: NotificationScenario;
  InstitutionRequestRegister: InstitutionRequestRegister;
  ApiResponseInstitutionResponse: APIResponseResponse;
  InstitutionResponse: InstitutionResponse;
  InstitutionPlanUpdateRequest: InstitutionPlanUpdateRequest;
  InstitutionUpdateLdpa: InstitutionUpdateLdpa;
  CuentaRequest: CuentaRequest;
  CronogramaRequest: CronogramaRequest;
  CuotaRequest: CuotaRequest;
  RegistroRequest: RegistroRequest;
  AlumnoRegistroRequest: AlumnoRe;
  AlumnoCargaMasivaResponse: CargaMasivaResponse;
  ApiResponseAlumnoCargaMasivaResponse: APIResponseResponse;
  PagoRequest: PagoRequest;
  ApiResponseListNotificacionResponse: APIResponseListResponse;
  NotificacionResponse: NotificacionResponse;
  MatriculaRequest: MatriculaRequest;
  ApiResponseMatriculaCargaMasivaResponse: APIResponseResponse;
  MatriculaCargaMasivaResponse: CargaMasivaResponse;
  AccessTokenResponse: AccessTokenResponse;
  ApiResponseAccessTokenResponse: APIResponseResponse;
  OtpVerificationRequest: OtpVerificationRequest;
  ApiResponseVoid: APIResponse;
  LoginRequest: LoginRequest;
  ApiResponseOtpChallengeResponse: APIResponseResponse;
  OtpChallengeResponse: OtpChallengeResponse;
  NotificationWebhookRequest: NotificationWebhookRequest;
  ApiResponsePageUsuarioResponse: APIResponseResponse;
  PageUsuarioResponse: PageResponse;
  PageableObject: PageableObject;
  SortObject: SortObject;
  UsuarioResponse: UsuarioResponse;
  ApiResponseUsuarioResponse: APIResponseResponse;
  AlumnoResponse: AlumnoRe;
  ApiResponsePageAlumnoResponse: APIResponseResponse;
  PageAlumnoResponse: PageResponse;
  AlumnoEstadoCuentaResponse: AlumnoEstadoCuentaResponse;
  ApiResponseAlumnoEstadoCuentaResponse: APIResponseResponse;
  MatriculaEstadoCuenta: MatriculaEstadoCuenta;
  PagoResponse: PagoResponse;
  ApiResponseBoolean: APIResponse;
  ApiResponseListPagoResponse: APIResponseListResponse;
  ApiResponseListNotificationScenarioResponse: APIResponseListResponse;
  ApiResponsePageInstitutionResponse: APIResponseResponse;
  PageInstitutionResponse: PageResponse;
  ApiResponsePlanActionsResponse: APIResponseResponse;
  PlanActionsResponse: PlanActionsResponse;
  ApiResponsePageCuentaResponse: APIResponseResponse;
  CuentaResponse: CuentaResponse;
  PageCuentaResponse: PageResponse;
  ApiResponseListCuentaResponse: APIResponseListResponse;
  ApiResponsePageCronogramaResponse: APIResponseResponse;
  CronogramaResponse: CronogramaResponse;
  PageCronogramaResponse: PageResponse;
  ApiResponseCronogramaDetalleResponse: APIResponseResponse;
  CronogramaDetalleResponse: CronogramaDetalleResponse;
  CuotaResponse: CuotaResponse;
  ApiResponseListCuotaResponse: APIResponseListResponse;
}

export interface AccessTokenResponse {
  type: AccessTokenType;
  properties: AccessTokenResponseProperties;
}

export interface AccessTokenResponseProperties {
  accessToken: AccessToken;
}

export interface AccessToken {
  type: AccessTokenType;
}

export enum AccessTokenType {
  Boolean = 'boolean',
  Number = 'number',
  Object = 'object',
  String = 'string',
}

export interface CargaMasivaResponse {
  type: AccessTokenType;
  properties: AlumnoCargaMasivaResponseProperties;
}

export interface AlumnoCargaMasivaResponseProperties {
  registrosCreados: RegistrosCreados;
  registrosOmitidos: RegistrosCreados;
  observaciones: Observaciones;
}

export interface Observaciones {
  type: AccionesDestacadasType;
  items: AccessToken;
}

export enum AccionesDestacadasType {
  Array = 'array',
}

export interface RegistrosCreados {
  type: RegistrosCreadosType;
  format?: Format;
}

export enum Format {
  Binary = 'binary',
  Date = 'date',
  DateTime = 'date-time',
  Double = 'double',
  Int32 = 'int32',
  Int64 = 'int64',
}

export enum RegistrosCreadosType {
  Integer = 'integer',
  Number = 'number',
  String = 'string',
}

export interface AlumnoEstadoCuentaResponse {
  type: AccessTokenType;
  properties: AlumnoEstadoCuentaResponseProperties;
}

export interface AlumnoEstadoCuentaResponseProperties {
  alumnoDni: AccessToken;
  nombreCompleto: AccessToken;
  matriculas: Matriculas;
  totalPagado: AccessToken;
  totalPendiente: AccessToken;
  morosidad: AccessToken;
}

export interface Matriculas {
  type: AccionesDestacadasType;
  items: Data;
}

export interface Data {
  $ref: string;
}

export interface AlumnoRe {
  type: AccessTokenType;
  properties: AlumnoRegistroRequestProperties;
}

export interface AlumnoRegistroRequestProperties {
  nombreCompleto: AccessToken;
  dni: AccessToken;
  grado: AccessToken;
  nivel: AccessToken;
  seccion: AccessToken;
  responsablePago: AccessToken;
  telefonoTutor: AccessToken;
  emailTutor: AccessToken;
  direccion: AccessToken;
  codAlumno?: AccessToken;
}

export interface AlumnoResponsableRequest {
  type: AccessTokenType;
  properties: AlumnoResponsableRequestProperties;
}

export interface AlumnoResponsableRequestProperties {
  responsablePago: AccessToken;
  telefonoTutor: AccessToken;
  emailTutor: AccessToken;
}

export interface AlumnoUpdateRequest {
  type: AccessTokenType;
  properties: AlumnoUpdateRequestProperties;
}

export interface AlumnoUpdateRequestProperties {
  nombreCompleto: AccessToken;
  grado: AccessToken;
  nivel: AccessToken;
  seccion: AccessToken;
  direccion: AccessToken;
}

export interface APIResponseResponse {
  type: AccessTokenType;
  properties: APIResponseAccessTokenResponseProperties;
}

export interface APIResponseAccessTokenResponseProperties {
  success: AccessToken;
  message: AccessToken;
  data: Data;
}

export interface APIResponse {
  type: AccessTokenType;
  properties: APIResponseBooleanProperties;
}

export interface APIResponseBooleanProperties {
  success: AccessToken;
  message: AccessToken;
  data: AccessToken;
}

export interface APIResponseListResponse {
  type: AccessTokenType;
  properties: APIResponseListCuentaResponseProperties;
}

export interface APIResponseListCuentaResponseProperties {
  success: AccessToken;
  message: AccessToken;
  data: Matriculas;
}

export interface ChangePasswordRequest {
  type: AccessTokenType;
  properties: ChangePasswordRequestProperties;
}

export interface ChangePasswordRequestProperties {
  oldPassword: AccessToken;
  newPassword: AccessToken;
  confirmPassword: AccessToken;
}

export interface CronogramaDetalleResponse {
  type: AccessTokenType;
  properties: CronogramaDetalleResponseProperties;
}

export interface CronogramaDetalleResponseProperties {
  id: RegistrosCreados;
  codigo: AccessToken;
  anioLectivo: RegistrosCreados;
  nivelEducativo: NivelEducativo;
  interesMoraCuota: AccessToken;
  activo: AccessToken;
  cuotas: Matriculas;
}

export interface NivelEducativo {
  type: AccessTokenType;
  enum?: string[];
}

export interface CronogramaRequest {
  type: AccessTokenType;
  properties: CronogramaRequestProperties;
}

export interface CronogramaRequestProperties {
  anioLectivo: RegistrosCreados;
  nivelEducativo: NivelEducativo;
  montoCuota: RegistrosCreados;
  numCuotas: RegistrosCreados;
  fechaInicio: RegistrosCreados;
  interesMoraCuota: AccessToken;
  activo: AccessToken;
}

export interface CronogramaResponse {
  type: AccessTokenType;
  properties: CronogramaResponseProperties;
}

export interface CronogramaResponseProperties {
  id: RegistrosCreados;
  codigo: AccessToken;
  anioLectivo: RegistrosCreados;
  nivelEducativo: NivelEducativo;
  montoCuota: AccessToken;
  numCuotas: RegistrosCreados;
  interesMoraCuota: AccessToken;
  fechaVencimiento: AccessToken;
  activo: AccessToken;
}

export interface CuentaRequest {
  type: AccessTokenType;
  properties: CuentaRequestProperties;
}

export interface CuentaRequestProperties {
  monto: AccessToken;
}

export interface CuentaResponse {
  type: AccessTokenType;
  properties: CuentaResponseProperties;
}

export interface CuentaResponseProperties {
  alumno_dni: AccessToken;
  cronograma_cuotas_id: RegistrosCreados;
  periodoAcademico: AccessToken;
  cuota: AccessToken;
  monto: AccessToken;
  saldo: AccessToken;
  fechaVencimiento: RegistrosCreados;
  estado: NivelEducativo;
}

export interface CuotaRequest {
  type: AccessTokenType;
  properties: CuotaRequestProperties;
}

export interface CuotaRequestProperties {
  monto: RegistrosCreados;
  fechaVencimiento: RegistrosCreados;
}

export interface CuotaResponse {
  type: AccessTokenType;
  properties: CuotaResponseProperties;
}

export interface CuotaResponseProperties {
  id: RegistrosCreados;
  numeroCuota: RegistrosCreados;
  monto: RegistrosCreados;
  fechaVencimiento: RegistrosCreados;
}

export interface InstitutionPlanUpdateRequest {
  type: AccessTokenType;
  properties: InstitutionPlanUpdateRequestProperties;
}

export interface InstitutionPlanUpdateRequestProperties {
  plan: NivelEducativo;
}

export interface InstitutionRequestRegister {
  type: AccessTokenType;
  properties: InstitutionRequestRegisterProperties;
}

export interface InstitutionRequestRegisterProperties {
  name: AccessToken;
  email: AccessToken;
  phoneNumber: AccessToken;
  address: AccessToken;
  plan: NivelEducativo;
}

export interface InstitutionResponse {
  type: AccessTokenType;
  properties: InstitutionResponseProperties;
}

export interface InstitutionResponseProperties {
  id: RegistrosCreados;
  name: AccessToken;
  email: AccessToken;
  phoneNumber: AccessToken;
  address: AccessToken;
  code: AccessToken;
  logoUrl: AccessToken;
  logoLoginUrl: AccessToken;
  useLdap: AccessToken;
  ldapHost: AccessToken;
  ldapPort: AccessToken;
  ldapBaseDn: AccessToken;
  ldapUserDn: AccessToken;
  plan: AccessToken;
  production: AccessToken;
}

export interface InstitutionUpdateLdpa {
  type: AccessTokenType;
  properties: InstitutionUpdateLdpaProperties;
}

export interface InstitutionUpdateLdpaProperties {
  ldapHost: AccessToken;
  ldapPort: AccessToken;
  ldapBaseDn: AccessToken;
  ldapUserDn: AccessToken;
  ldapPassword: AccessToken;
  useLdap: AccessToken;
}

export interface LoginRequest {
  type: AccessTokenType;
  properties: LoginRequestProperties;
}

export interface LoginRequestProperties {
  nombreUsuario: AccessToken;
  contrasena: AccessToken;
  institutionCode: AccessToken;
  recordarDispositivo: AccessToken;
}

export interface MatriculaEstadoCuenta {
  type: AccessTokenType;
  properties: MatriculaEstadoCuentaProperties;
}

export interface MatriculaEstadoCuentaProperties {
  id: RegistrosCreados;
  periodoAcademico: AccessToken;
  montoTotal: AccessToken;
  saldoPendiente: AccessToken;
  estado: NivelEducativo;
  totalPagado: AccessToken;
  morosidad: AccessToken;
  pagos: Matriculas;
}

export interface MatriculaRequest {
  type: AccessTokenType;
  properties: MatriculaRequestProperties;
}

export interface MatriculaRequestProperties {
  id_cronograma: RegistrosCreados;
  id_alumno: RegistrosCreados;
}

export interface NotificacionConfigracionRe {
  type: AccessTokenType;
  properties: NotificacionConfigracionRegisterProperties;
}

export interface NotificacionConfigracionRegisterProperties {
  medioEnvio: NivelEducativo;
  frecuencia: AccessToken;
  diadDelMes: RegistrosCreados;
  horaEnvio: AccessToken;
  activo: AccessToken;
  mensaje: AccessToken;
  asunto: AccessToken;
  institutionCode: AccessToken;
  notificationScenarioId?: RegistrosCreados;
  id?: RegistrosCreados;
  notificationScenario?: Data;
}

export interface NotificacionResponse {
  type: AccessTokenType;
  properties: NotificacionResponseProperties;
}

export interface NotificacionResponseProperties {
  id: RegistrosCreados;
  canal: AccessToken;
  destinatario: AccessToken;
  asunto: AccessToken;
  mensaje: AccessToken;
  fechaProgramada: RegistrosCreados;
  proximoIntento: RegistrosCreados;
  estado: NivelEducativo;
  intentos: RegistrosCreados;
  horaCreacion: RegistrosCreados;
  ultimaActualizacion: RegistrosCreados;
  fechaEnvio: RegistrosCreados;
  fechaConfirmacion: RegistrosCreados;
  ultimoError: AccessToken;
  estadoProveedor: AccessToken;
  externalId: AccessToken;
  configuracionId: RegistrosCreados;
  medioEnvio: NivelEducativo;
  frecuencia: AccessToken;
  cuotaId: RegistrosCreados;
  numeroCuota: RegistrosCreados;
}

export interface NotificationScenario {
  type: AccessTokenType;
  properties: NotificationScenarioRequestProperties;
}

export interface NotificationScenarioRequestProperties {
  description: AccessToken;
  relativeDays: RegistrosCreados;
  active: AccessToken;
  subjectTemplate: AccessToken;
  messageTemplate: AccessToken;
  id?: RegistrosCreados;
}

export interface NotificationWebhookRequest {
  type: AccessTokenType;
  properties: NotificationWebhookRequestProperties;
}

export interface NotificationWebhookRequestProperties {
  notificationId: RegistrosCreados;
  externalId: AccessToken;
  estado: AccessToken;
  descripcion: AccessToken;
  fechaEvento: AccessToken;
}

export interface OtpChallengeResponse {
  type: AccessTokenType;
  properties: OtpChallengeResponseProperties;
}

export interface OtpChallengeResponseProperties {
  challengeId: AccessToken;
  expiresInSeconds: RegistrosCreados;
}

export interface OtpVerificationRequest {
  type: AccessTokenType;
  properties: OtpVerificationRequestProperties;
}

export interface OtpVerificationRequestProperties {
  challengeId: AccessToken;
  otp: AccessToken;
}

export interface PageResponse {
  type: AccessTokenType;
  properties: PageAlumnoResponseProperties;
}

export interface PageAlumnoResponseProperties {
  totalElements: RegistrosCreados;
  totalPages: RegistrosCreados;
  size: RegistrosCreados;
  content: Matriculas;
  number: RegistrosCreados;
  first: AccessToken;
  last: AccessToken;
  numberOfElements: RegistrosCreados;
  sort: Data;
  pageable: Data;
  empty: AccessToken;
}

export interface PageableObject {
  type: AccessTokenType;
  properties: PageableObjectProperties;
}

export interface PageableObjectProperties {
  offset: RegistrosCreados;
  sort: Data;
  paged: AccessToken;
  pageNumber: RegistrosCreados;
  pageSize: RegistrosCreados;
  unpaged: AccessToken;
}

export interface PagoRequest {
  type: AccessTokenType;
  properties: PagoRequestProperties;
}

export interface PagoRequestProperties {
  idAlumno: RegistrosCreados;
  idUsuario: RegistrosCreados;
  idMatricula: RegistrosCreados;
  idCuota: RegistrosCreados;
  montoPagado: AccessToken;
  fechaPago: AccessToken;
  metodoPago: NivelEducativo;
  numeroOperacion: AccessToken;
  observaciones: AccessToken;
  pasarela: NivelEducativo;
}

export interface PagoResponse {
  type: AccessTokenType;
  properties: PagoResponseProperties;
}

export interface PagoResponseProperties {
  id: RegistrosCreados;
  idMatricula: RegistrosCreados;
  idCuota: RegistrosCreados;
  alumnoDni: AccessToken;
  montoPagado: AccessToken;
  fechaPago: RegistrosCreados;
  metodoPago: NivelEducativo;
  pasarela: NivelEducativo;
  numeroOperacion: AccessToken;
  observaciones: AccessToken;
}

export interface PasarelaPagoRe {
  type: AccessTokenType;
  properties: PasarelaPagoRegisterProperties;
}

export interface PasarelaPagoRegisterProperties {
  apiSecret: AccessToken;
  apiPublicKey: AccessToken;
  tipo: NivelEducativo;
  urlBase: AccessToken;
  urlWebhook: AccessToken;
  institutionCode: AccessToken;
  activo: AccessToken;
  id?: RegistrosCreados;
}

export interface PlanActionsResponse {
  type: AccessTokenType;
  properties: PlanActionsResponseProperties;
}

export interface PlanActionsResponseProperties {
  plan: NivelEducativo;
  canalesDisponibles: Observaciones;
  escenariosDeEnvio: RegistrosCreados;
  personalizacionPorEscenario: AccessToken;
  accionesDestacadas: Observaciones;
}

export interface RegistroRequest {
  type: AccessTokenType;
  properties: RegistroRequestProperties;
}

export interface RegistroRequestProperties {
  contrasena: AccessToken;
  nombreCompleto: AccessToken;
  correo: AccessToken;
  rol: NivelEducativo;
  institutionId: RegistrosCreados;
}

export interface SortObject {
  type: AccessTokenType;
  properties: SortObjectProperties;
}

export interface SortObjectProperties {
  empty: AccessToken;
  sorted: AccessToken;
  unsorted: AccessToken;
}

export interface UsuarioResponse {
  type: AccessTokenType;
  properties: UsuarioResponseProperties;
}

export interface UsuarioResponseProperties {
  nombreCompleto: AccessToken;
  correo: AccessToken;
  rol: NivelEducativo;
  activo: AccessToken;
  id: RegistrosCreados;
  institutionId: RegistrosCreados;
}

export interface SecuritySchemes {
  bearerAuth: BearerAuth;
}

export interface BearerAuth {
  type: string;
  name: string;
  scheme: string;
  bearerFormat: string;
}

export interface Info {
  title: string;
  description: string;
  version: string;
}

export interface Paths {
  '/usuario/rol/{id}': StudentDniIDClass;
  '/usuario/desactivar/{id}': CronogramaCutoaID;
  '/usuario/cambiar-contrasena': UsuarioCambiarContrasena;
  '/student/{id}': StudentID;
  '/student/tutor/{id}': CronogramaCutoaID;
  '/student/dni/{id}': StudentDniIDClass;
  '/pasarela-pago/{code}': PasarelaPagoCode;
  '/notification-scenarios/{id}': NotificationScenariosID;
  '/notificacion-configuracion/{code}/medio/{medioEnvio}': NotificacionConfiguracionCodeMedioMedioEnvio;
  '/institutions/{id}': CronogramaIDClass;
  '/institutions/{id}/plan': InstitutionsIDPlan;
  '/institutions/{id}/ldap': CronogramaCutoaID;
  '/estado-cuenta/cambiar-monto/{id_estado_cuenta}': CronogramaCutoaID;
  '/cronograma/{id}': CronogramaIDClass;
  '/cronograma/cutoa/{id}': CronogramaCutoaID;
  '/usuario': Usuario;
  '/student': Student;
  '/student/upload': AuthOtpVerify;
  '/pasarela-pago': AuthLogout;
  '/pasarela-pago/procesar': AuthOtpVerify;
  '/notification-scenarios': Institutions;
  '/notificaciones/cuota/{cuotaId}/automatico': AuthLogout;
  '/notificacion-configuracion': AuthLogout;
  '/institutions': Institutions;
  '/estado-cuenta/matricula': AuthOtpVerify;
  '/estado-cuenta/matricula/carga-masiva': AuthOtpVerify;
  '/cronograma': Cronograma;
  '/auth/refresh': Auth;
  '/auth/otp/verify': AuthOtpVerify;
  '/auth/logout': AuthLogout;
  '/auth/login': Auth;
  '/api/webhooks/notifications': APIWebhooksNotifications;
  '/usuario/perfil': UsuarioPerfil;
  '/usuario/{id}': UsuarioID;
  '/student/{id}/statement': EstadoCuenta;
  '/pasarela-pago/institucion/{code}': IonCode;
  '/pasarela-pago/existe/{code}': EstadoCuentaMatriculaAlumnoIDAlumnoCronogramaIDCronograma;
  '/pagos/matricula/{matriculaId}': EstadoCuentaMatriculaAlumnoIDAlumnoCronogramaIDCronograma;
  '/pagos/cuota/{cuotaId}': EstadoCuentaMatriculaAlumnoIDAlumnoCronogramaIDCronograma;
  '/pagos/alumno/{alumnoId}': EstadoCuentaMatriculaAlumnoIDAlumnoCronogramaIDCronograma;
  '/notificaciones/cuota/{cuotaId}': EstadoCuentaMatriculaAlumnoIDAlumnoCronogramaIDCronograma;
  '/notificaciones/configuracion/{configuracionId}': EstadoCuentaMatriculaAlumnoIDAlumnoCronogramaIDCronograma;
  '/notificacion-configuracion/institucion/{code}/medio/{medioEnvio}': NotificacionConfiguracionInstitucionCodeMedioMedioEnvio;
  '/notificacion-configuracion/existe/{code}/medio/{medioEnvio}': EstadoCuentaMatriculaAlumnoIDAlumnoCronogramaIDCronograma;
  '/institutions/{id}/plan/actions': CronogramaIDCuotas;
  '/institutions/code/{institutionCode}': IonCode;
  '/estado-cuenta': EstadoCuenta;
  '/estado-cuenta/matricula/alumno/{id_alumno}/cronograma/{id_cronograma}': EstadoCuentaMatriculaAlumnoIDAlumnoCronogramaIDCronograma;
  '/cronograma/{id}/cuotas': CronogramaIDCuotas;
  '/usuario/delete-all': UsuarioDeleteAll;
}

export interface APIWebhooksNotifications {
  post: APIWebhooksNotificationsPost;
}

export interface APIWebhooksNotificationsPost {
  tags: string[];
  operationId: string;
  requestBody: DeleteRequestBody;
  responses: PurpleResponses;
}

export interface DeleteRequestBody {
  content: PurpleContent;
  required: boolean;
}

export interface PurpleContent {
  'application/json': PurpleApplicationJSON;
}

export interface PurpleApplicationJSON {
  schema: Data;
}

export interface PurpleResponses {
  '200': The200;
}

export interface The200 {
  description: string;
}

export interface Auth {
  post: AuthLoginPost;
}

export interface AuthLoginPost {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  requestBody?: DeleteRequestBody;
  responses: { [key: string]: Response };
}

export interface Response {
  description: string;
  content: ResponseContent;
}

export interface ResponseContent {
  'application/json': FluffyApplicationJSON;
}

export interface FluffyApplicationJSON {
  schema: Data;
  example: null;
}

export interface AuthLogout {
  post: DeleteClass;
}

export interface DeleteClass {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  responses: GetResponses;
  parameters?: PostParameter[];
  requestBody?: DeleteRequestBody;
}

export interface PostParameter {
  name: string;
  in: In;
  description?: string;
  required: boolean;
  schema: ParameterSchema;
}

export enum In {
  Path = 'path',
  Query = 'query',
}

export interface ParameterSchema {
  type: PurpleType;
  format?: Format;
  default?: number | string;
  enum?: string[];
}

export enum PurpleType {
  Boolean = 'boolean',
  Integer = 'integer',
  String = 'string',
}

export interface GetResponses {
  '200': Response;
}

export interface AuthOtpVerify {
  post: AuthOtpVerifyPost;
}

export interface AuthOtpVerifyPost {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  requestBody?: PurpleRequestBody;
  responses: { [key: string]: Response };
  parameters?: PostParameter[];
}

export interface PurpleRequestBody {
  content: FluffyContent;
  required?: boolean;
}

export interface FluffyContent {
  'application/json': TentacledApplicationJSON;
}

export interface TentacledApplicationJSON {
  schema: ApplicationJSONSchema;
}

export interface ApplicationJSONSchema {
  $ref?: string;
  required?: string[];
  type?: AccessTokenType;
  properties?: SchemaProperties;
}

export interface SchemaProperties {
  file: File;
}

export interface File {
  type: AccessTokenType;
  format: Format;
  description?: string;
}

export interface Cronograma {
  get: DeleteClass;
  post: AuthOtpVerifyPost;
}

export interface CronogramaCutoaID {
  put: GetClass;
}

export interface GetClass {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  parameters: PurpleParameter[];
  requestBody?: DeleteRequestBody;
  responses: { [key: string]: Response };
}

export interface PurpleParameter {
  name: string;
  in: In;
  required: boolean;
  schema: RegistrosCreados;
}

export interface CronogramaIDClass {
  get: GetClass;
  put: GetClass;
  delete: GetClass;
}

export interface CronogramaIDCuotas {
  get: GetClass;
}

export interface EstadoCuenta {
  get: AuthOtpVerifyPost;
}

export interface EstadoCuentaMatriculaAlumnoIDAlumnoCronogramaIDCronograma {
  get: DeleteClass;
}

export interface Institutions {
  get: DeleteClass;
  post: DeleteClass;
}

export interface IonCode {
  get: InstitutionsCodeInstitutionCodeGet;
}

export interface InstitutionsCodeInstitutionCodeGet {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  parameters: FluffyParameter[];
  responses: { [key: string]: Response };
  requestBody?: DeleteRequestBody;
}

export interface FluffyParameter {
  name: string;
  in: In;
  required: boolean;
  schema: AccessToken;
}

export interface InstitutionsIDPlan {
  put: InstitutionsIDPlanPut;
}

export interface InstitutionsIDPlanPut {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  parameters: PurpleParameter[];
  requestBody: DeleteRequestBody;
  responses: { [key: string]: Response };
}

export interface NotificacionConfiguracionInstitucionCodeMedioMedioEnvio {
  get: NotificacionConfiguracionInstitucionCodeMedioMedioEnvioGet;
}

export interface NotificacionConfiguracionInstitucionCodeMedioMedioEnvioGet {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  parameters: TentacledParameter[];
  responses: { [key: string]: Response };
  requestBody?: DeleteRequestBody;
}

export interface TentacledParameter {
  name: string;
  in: In;
  required: boolean;
  schema: NivelEducativo;
}

export interface NotificacionConfiguracionCodeMedioMedioEnvio {
  put: NotificacionConfiguracionInstitucionCodeMedioMedioEnvioGet;
}

export interface NotificationScenariosID {
  get: DeleteClass;
  put: DeleteClass;
  delete: DeleteClass;
}

export interface PasarelaPagoCode {
  put: InstitutionsCodeInstitutionCodeGet;
}

export interface Student {
  get: AuthOtpVerifyPost;
  post: AuthOtpVerifyPost;
}

export interface StudentDniIDClass {
  put: StudentDniIDPut;
}

export interface StudentDniIDPut {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  parameters: PurpleParameter[];
  responses: { [key: string]: Response };
}

export interface StudentID {
  put: GetClass;
  delete: InstitutionsCodeInstitutionCodeGet;
}

export interface Usuario {
  get: DeleteClass;
  post: PurplePost;
}

export interface PurplePost {
  tags: string[];
  summary: string;
  description: string;
  operationId: string;
  requestBody: DeleteRequestBody;
  responses: { [key: string]: Response };
}

export interface UsuarioCambiarContrasena {
  put: AuthOtpVerifyPost;
}

export interface UsuarioDeleteAll {
  delete: DeleteClass;
}

export interface UsuarioPerfil {
  get: DeleteClass;
  patch: DeleteClass;
}

export interface UsuarioID {
  get: GetClass;
  delete: GetClass;
}

export interface Security {
  bearerAuth: any[];
}

export interface Server {
  url: string;
  description: string;
}

export interface Tag {
  name: string;
  description: string;
}
