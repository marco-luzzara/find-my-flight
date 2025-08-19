import { Box, LoadingOverlay } from "@mantine/core";

export default function FullPageLoadingOverlay({ isVisible }: { isVisible: boolean }) {
    return (
        <Box pos="fixed" top={0} left={0} w="100vw" h="100vh" style={{ zIndex: isVisible ? 1000 : -1 }}>
            <Box pos="relative">
                <LoadingOverlay visible={isVisible} zIndex={1000} overlayProps={{ radius: "sm", blur: 2 }} />
                { 
                    isVisible ? (
                        <Box w="100vw" h="100vh">
                        </Box>
                    ) :
                    (
                        <div style={{ display: "none" }}></div>
                    )
                }
            </Box>
        </Box>
    )
}