export enum Role { USER = 'USER', ADMIN = 'ADMIN' }
export enum UserStatus { ACTIVE = 'ACTIVE', BLOCKED = 'BLOCKED', DELETED = 'DELETED', PENDING = 'PENDING' }
export enum EventStatus { UPCOMING = 'UPCOMING', ONGOING = 'ONGOING', COMPLETED = 'COMPLETED', CANCELLED = 'CANCELLED' }
export enum EventType { PUBLIC = 'PUBLIC', PRIVATE = 'PRIVATE' }
export enum RequestStatus { PENDING = 'PENDING', APPROVED = 'APPROVED', REJECTED = 'REJECTED', BANNED = 'BANNED' }
export enum PaymentStatus { PENDING = 'PENDING', PAID = 'PAID', FAILED = 'FAILED', REFUNDED = 'REFUNDED' }