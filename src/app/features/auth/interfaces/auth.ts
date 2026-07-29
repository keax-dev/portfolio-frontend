import type { AuthDto, AuthDtoWritable } from '@shared/api/generated';

export type LoginCredentials = Readonly<Pick<AuthDtoWritable, 'username' | 'password'>>;

export type LoginResponse = Readonly<Required<Pick<AuthDto, 'token'>>>;
