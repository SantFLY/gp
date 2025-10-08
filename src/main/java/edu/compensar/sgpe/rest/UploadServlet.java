package edu.compensar.sgpe.rest;

import jakarta.servlet.annotation.MultipartConfig;
import jakarta.servlet.annotation.WebServlet;
import jakarta.servlet.http.HttpServlet;
import jakarta.servlet.http.HttpServletRequest;
import jakarta.servlet.http.HttpServletResponse;
import jakarta.servlet.http.Part;
import java.io.File;
import java.io.IOException;
import java.io.InputStream;
import java.nio.file.Files;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

@WebServlet(name="UploadServlet", urlPatterns={"/api/upload"})
@MultipartConfig(fileSizeThreshold = 1024*1024, // 1MB
                 maxFileSize = 10L * 1024 * 1024, // 10MB
                 maxRequestSize = 20L * 1024 * 1024)
public class UploadServlet extends HttpServlet {

    @Override
    protected void doPost(HttpServletRequest req, HttpServletResponse resp) throws IOException {
        Part filePart;
        try {
            filePart = req.getPart("file");
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"No se encontró el archivo en el formulario (campo 'file')\"}");
            return;
        }
        if (filePart == null || filePart.getSize() == 0) {
            resp.setStatus(HttpServletResponse.SC_BAD_REQUEST);
            resp.getWriter().write("{\"error\":\"Archivo vacío o no enviado\"}");
            return;
        }

        String uploadsDir = req.getServletContext().getRealPath("/uploads");
        File uploads = new File(uploadsDir);
        if (!uploads.exists()) uploads.mkdirs();

        String submitted = filePart.getSubmittedFileName();
        String timestamp = LocalDateTime.now().format(DateTimeFormatter.ofPattern("yyyyMMddHHmmss"));
        String safeName = timestamp + "_" + submitted.replaceAll("[^a-zA-Z0-9_.-]","_");
        File out = new File(uploads, safeName);
        try (InputStream in = filePart.getInputStream()) {
            Files.copy(in, out.toPath());
        } catch (Exception e) {
            resp.setStatus(HttpServletResponse.SC_INTERNAL_SERVER_ERROR);
            resp.getWriter().write("{\"error\":\"Error guardando el archivo: " + e.getMessage() + "\"}");
            return;
        }
        String url = req.getContextPath() + "/uploads/" + safeName;
        resp.setContentType("application/json;charset=UTF-8");
        resp.getWriter().write(String.format("{\"fileUrl\":\"%s\"}", url));
    }
}
