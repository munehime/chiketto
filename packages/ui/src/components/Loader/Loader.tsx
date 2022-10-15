import { FunctionComponent } from "react";

const Loader: FunctionComponent<any> = ({
                                            loadingImage
                                        }: {
    loadingImage?: string
}) => {
    return (
        <div className="flex justify-center items-center min-h-[75vh]">
            <div
                className="flex justify-center items-center animate-[spin_2.5s_linear_infinite] h-32 w-32 bg-black/75 rounded-lg overflow-hidden">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={loadingImage} alt="Loading image" className="object-cover min-w-full min-h-full"/>
            </div>
        </div>
    );
};

export default Loader;
