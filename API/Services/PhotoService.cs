using API.Helpers;
using API.Interfaces;
using CloudinaryDotNet;
using CloudinaryDotNet.Actions;
using Microsoft.Extensions.Options;

namespace API.Services;

public class PhotoService : IPhotoService
{
    private readonly Cloudinary _cloudinary;

    public PhotoService(IOptions<CloudinarySetting> config)
{
    Console.WriteLine($"CloudName: {config.Value.CloudName}");
    Console.WriteLine($"ApiKey: {config.Value.ApiKey}");
    Console.WriteLine($"ApiSecret: {config.Value.ApiSecret}");

    var account = new Account(
        config.Value.CloudName,
        config.Value.ApiKey,
        config.Value.ApiSecret
    );

    _cloudinary = new Cloudinary(account);
}

    public async Task<DeletionResult> DeletePhotoAsync(string publicId)
    {
        var deleteParam = new DeletionParams(publicId);

        return await _cloudinary.DestroyAsync(deleteParam);
    }

    public async Task<ImageUploadResult> UploadPhotoAsync(IFormFile file)
    {
        var uploadResult = new ImageUploadResult();
        if (file.Length > 0)
        {
            await using var stream = file.OpenReadStream();
            var uploadParam = new ImageUploadParams
            {
                File = new FileDescription(file.FileName, stream),
                Transformation = new Transformation().Height(500).Width(500).Crop("fill").Gravity("face"),
                Folder = "DatingApp"
            };
            uploadResult = await _cloudinary.UploadAsync(uploadParam);

        }
         return uploadResult;

    }
}
