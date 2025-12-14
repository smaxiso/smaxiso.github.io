import siteConfig from "@/data/site-config.json";
import hobbiesData from "@/data/hobbies-data.json";

export default function Hobbies() {
    const { hobbies: hobbiesConfig } = siteConfig;
    const { hobbies } = hobbiesData;

    return (
        <section className="hobbies section" id="hobbies">
            <div className="container">
                <h2 className="section-title text-center mb-12">{hobbiesConfig.sectionTitle}</h2>

                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                    {hobbies.map((hobby, index) => (
                        <div
                            key={index}
                            className="bg-surface-0 p-6 rounded-xl shadow-md hover:shadow-xl transition-all duration-300 border border-outline-variant hover:border-primary-200 group text-center"
                        >
                            <i className={`${hobby.icon} text-4xl text-primary-600 mb-4 inline-block group-hover:scale-110 transition-transform`}></i>
                            <h3 className="text-lg font-semibold mb-2">{hobby.name}</h3>
                            <p className="text-sm text-on-surface-variant mb-4">{hobby.description}</p>

                            {/* @ts-ignore */}
                            {hobby.link && (
                                <a
                                    href={hobby.link}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="btn btn-outline text-xs px-4 py-2 mt-auto"
                                >
                                    Learn More
                                </a>
                            )}
                        </div>
                    ))}
                </div>
            </div>
        </section>
    );
}
