import { Head } from '@inertiajs/react';
import Header from '../Components/Header';
import HeroSection from '../Components/HeroSection';
import ProceduresGrid from '../Components/ProceduresGrid';
import TestimonialsSection from '../Components/TestimonialsSection';
import Footer from '../Components/Footer';

export default function Welcome({ auth }) {
    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen">
                <Header auth={auth} />
                <HeroSection />
                <ProceduresGrid />
                <TestimonialsSection />
                <Footer />
            </div>
        </>
    );
}
