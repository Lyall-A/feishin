import type { ReactNode, Ref } from 'react';

import { motion } from 'motion/react';
import { forwardRef } from 'react';

import styles from './animated-page.module.css';

import { animationProps } from '/@/shared/components/animations/animation-props';

interface AnimatedPageProps {
    children: ReactNode;
}

export const AnimatedPage = forwardRef(
    ({ children }: AnimatedPageProps, ref: Ref<HTMLDivElement>) => {
        return (
            <motion.main
                className={styles.animatedPage}
                ref={ref}
                {...animationProps.fadeIn}
            >
                {children}
            </motion.main>
        );
    },
);
