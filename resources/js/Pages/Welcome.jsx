import { Head } from '@inertiajs/react';
import Header from '../Components/Header';
import HeroSection from '../Components/HeroSection';
import ProceduresGrid from '../Components/ProceduresGrid';
import CostEstimatorForm from '../Components/CostEstimatorForm';
import TestimonialsSection from '../Components/TestimonialsSection';
import Footer from '../Components/Footer';

export default function Welcome({ auth }) {
    const scrollToEstimator = () => {
        const element = document.getElementById('estimator');
        if (element) {
            element.scrollIntoView({ behavior: 'smooth' });
        }
    };

    return (
        <>
            <Head title="Welcome" />
            <div className="min-h-screen">
                <Header auth={auth} />
                <HeroSection />
                <ProceduresGrid onEstimateClick={scrollToEstimator} />
                <CostEstimatorForm />
                <TestimonialsSection />
                <Footer />
            </div>
        </>
    );
}
