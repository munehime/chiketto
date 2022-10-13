import { FunctionComponent, ReactNode } from "react";

const Layout: FunctionComponent<any> = ({
                    children
                }: {
                    children: ReactNode
                }
) => {
    return (
        <div>
            {children}
        </div>
    );
};

export default Layout;
