
export default function Today() {
    return (
        <div className="p-4 space-y-4">
            <h1 className="text-2xl font-bold">Dnes</h1>
            <p className="text-muted-foreground">Prehľad dňa</p>
            <div className="p-4 border rounded-xl bg-slate-50">
                <p>Vitajte v NOXUN OS. Dnes nemáte žiadne urgentné upozornenia.</p>
            </div>
        </div>
    );
}
