export function RoleRouteNotice({ message }: { message: string }) {
    return (
        <div className="rounded-xl border border-primary-100 bg-white p-6">
            <p className="text-sm font-medium text-slate-600">{message}</p>
        </div>
    );
}
