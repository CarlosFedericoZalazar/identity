
export const alertNotyf = () => {
    console.log("Notyf creado");
    const notyf = new Notyf({
        position: { x: "center", y: "top" },
        types: [
            {
                type: "success",
                background: "#22c55e",
                duration: 3000,
                style: { width: "500px" }
            },
            {
                type: "error",
                background: "#ef4444",
                duration: 5000,
                style: { width: "500px" }
            }
        ]
    });

    return notyf;
}
