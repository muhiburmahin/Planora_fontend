import { Button } from "@/components/ui";
const HomePage = () => {
    return (
        <div className="flex flex-col items-center justify-center min-h-screen gap-6">
            <h1 className="text-4xl font-bold">Welcome to Planora</h1>
            <p className="text-lg text-gray-600">Your all-in-one project management tool</p>
            <div className="flex gap-4">
                <Button variant="primary">Get Started</Button>
                <Button variant="outline">Learn More</Button>
            </div>
        </div>
    );
}
export default HomePage;